"use client";

import { useEffect } from "react";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Hard limits so no combination of attributes can make the page feel unstable. */
const MAX_TILT = 5; // degrees
const MAX_MAGNET_X = 3.5; // px
const MAX_MAGNET_Y = 3; // px

type Tilt = { rx: number; ry: number; trx: number; try: number };

/**
 * One small, global interaction layer (mounted once per page), driven by data attributes:
 *   data-reveal      fades/slides in when scrolled into view (stagger with --i)
 *   data-fx          pointer-following light + edge highlight, clipped to the element (--px/--py, --dx/--dy, class .fx-on)
 *   data-tilt="4"    gentle 3D tilt toward the pointer, eased in JS (degrees, capped at MAX_TILT)
 *   data-magnetic    moves a few pixels toward the pointer (--tx/--ty, applied through `translate`)
 * Pointer effects run only for a fine, hovering pointer and never with reduced motion; touch gets a brief light
 * flash on tap instead. All pointer work is coalesced into one requestAnimationFrame loop that stops when settled.
 * Elements inside [data-no-fx] (e.g. the interactive software showcase) are ignored so clicks never trigger effects.
 */
export function Fx() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");

    // ---- scroll reveal (all devices; CSS makes it a no-op for reduced motion) ----
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reveals.length) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add("in");
            io.unobserve(e.target);
          }),
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      reveals.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }
    if (reduced.matches) return () => cleanups.forEach((f) => f());

    // ---- touch: a brief light flash where the finger lands (no hover on touch screens) ----
    if (!fine.matches) {
      const flash = (e: PointerEvent) => {
        if (e.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest("[data-no-fx]")) return;
        const el = e.target.closest<HTMLElement>("[data-fx]");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--py", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
        el.classList.add("fx-on");
        window.setTimeout(() => el.classList.remove("fx-on"), 420);
      };
      document.addEventListener("pointerdown", flash, { passive: true });
      cleanups.push(() => document.removeEventListener("pointerdown", flash));
      return () => cleanups.forEach((f) => f());
    }

    // ---- fine pointer: eased tilt, light, magnet ----
    const tilts = new Map<HTMLElement, Tilt>();
    let pending: PointerEvent | null = null;
    let raf = 0;
    let lit: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;

    const release = (el: HTMLElement) => {
      el.classList.remove("fx-on");
      const t = tilts.get(el);
      if (t) {
        t.trx = 0;
        t.try = 0;
      }
    };
    const unmagnet = () => {
      if (!magnet) return;
      magnet.style.setProperty("--tx", "0px");
      magnet.style.setProperty("--ty", "0px");
      magnet = null;
    };

    const frame = () => {
      raf = 0;
      const e = pending;
      pending = null;

      if (e) {
        const target = e.target instanceof Element && !e.target.closest("[data-no-fx]") ? e.target : null;
        const hit = target?.closest<HTMLElement>("[data-fx]") ?? null;
        if (lit && lit !== hit) release(lit);
        lit = hit;
        if (hit) {
          const r = hit.getBoundingClientRect();
          const px = clamp((e.clientX - r.left) / r.width, 0, 1);
          const py = clamp((e.clientY - r.top) / r.height, 0, 1);
          hit.classList.add("fx-on");
          hit.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
          hit.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
          hit.style.setProperty("--dx", ((px - 0.5) * 2).toFixed(3));
          hit.style.setProperty("--dy", ((py - 0.5) * 2).toFixed(3));
          if (hit.hasAttribute("data-tilt")) {
            const max = clamp(parseFloat(hit.dataset.tilt ?? "") || 3, 0, MAX_TILT);
            const t = tilts.get(hit) ?? { rx: 0, ry: 0, trx: 0, try: 0 };
            t.trx = (0.5 - py) * 2 * max;
            t.try = (px - 0.5) * 2 * max;
            tilts.set(hit, t);
          }
        }

        const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
        if (magnet && magnet !== m) unmagnet();
        if (m) {
          const r = m.getBoundingClientRect();
          m.style.setProperty("--tx", `${clamp((e.clientX - (r.left + r.width / 2)) * 0.07, -MAX_MAGNET_X, MAX_MAGNET_X).toFixed(1)}px`);
          m.style.setProperty("--ty", `${clamp((e.clientY - (r.top + r.height / 2)) * 0.1, -MAX_MAGNET_Y, MAX_MAGNET_Y).toFixed(1)}px`);
          magnet = m;
        }
      }

      // Exponential smoothing: a soft ease in and out, never a snap.
      let busy = false;
      tilts.forEach((t, el) => {
        t.rx += (t.trx - t.rx) * 0.12;
        t.ry += (t.try - t.ry) * 0.12;
        const settled = Math.abs(t.trx - t.rx) < 0.02 && Math.abs(t.try - t.ry) < 0.02;
        if (settled && t.trx === 0 && t.try === 0) {
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
          tilts.delete(el);
        } else {
          el.style.setProperty("--rx", `${t.rx.toFixed(2)}deg`);
          el.style.setProperty("--ry", `${t.ry.toFixed(2)}deg`);
          if (!settled) busy = true;
        }
      });
      if (pending || busy || tilts.size) raf = requestAnimationFrame(frame);
    };
    const schedule = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pending = e;
      schedule();
    };
    const onLeave = () => {
      pending = null;
      if (lit) release(lit);
      lit = null;
      unmagnet();
      schedule();
    };
    const onVisibility = () => {
      if (!document.hidden) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      onLeave();
      tilts.forEach((_, el) => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
      tilts.clear();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      if (raf) cancelAnimationFrame(raf);
      if (lit) lit.classList.remove("fx-on");
      tilts.forEach((_, el) => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
      unmagnet();
    });
    return () => cleanups.forEach((f) => f());
  }, []);

  return null;
}
