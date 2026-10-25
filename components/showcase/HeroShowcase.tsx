"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { SLIDES } from "@/components/showcase/slides";
import "./showcase.css";

const INTERVAL = 4800; // ms between automatic slides
const REDUCED = "(prefers-reduced-motion: reduce)";

function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(REDUCED);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(REDUCED).matches,
    () => false,
  );
}

/** True once React has taken over in the browser (false in server HTML). Used as a readiness marker. */
const useHydrated = () => useSyncExternalStore(() => () => {}, () => true, () => false);

/** Only keyboard-style focus pauses autoplay; clicking a control with the mouse must not freeze it forever. */
const isKeyboardFocus = (el: EventTarget) => {
  try {
    return (el as Element).matches(":focus-visible");
  } catch {
    return true; // very old browsers: err on the side of pausing
  }
};

type State = { index: number; leaving: number; dir: 1 | -1 };

/**
 * Auto-sliding, interactive product showcase.
 *  - The autoplay timer is keyed to (index, running), so re-renders never reset it.
 *  - It pauses on user pause, mouse hover, keyboard focus, hidden tab, reduced motion, and once the visitor starts
 *    using a demo inside a slide ("engaged"); manual navigation hands control back to autoplay.
 *  - The stage is marked data-no-fx: pointer tilt/light never applies to it, and clicks inside a slide only reach
 *    that slide's own controls. Carousel keyboard shortcuts apply to the carousel controls, not to the demos.
 *  - Inactive slides are `inert` and aria-hidden; live announcements are off while autoplaying.
 */
export function HeroShowcase() {
  const slides = SLIDES;
  const n = slides.length;
  const reduced = useReducedMotion();
  const hydrated = useHydrated();
  const [{ index, leaving, dir }, setState] = useState<State>({ index: 0, leaving: -1, dir: 1 });
  const [userPaused, setUserPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const running = !userPaused && !engaged && !hovered && !focused && !hidden && !reduced;

  const go = useCallback(
    (step: number) => {
      setEngaged(false);
      setState((s) => ({ index: (s.index + step + n) % n, leaving: s.index, dir: step >= 0 ? 1 : -1 }));
    },
    [n],
  );
  const goTo = useCallback((i: number) => {
    setEngaged(false);
    setState((s) => (i === s.index ? s : { index: i, leaving: s.index, dir: i > s.index ? 1 : -1 }));
  }, []);

  // One timeout per (slide, running) pair; cleared on any change or unmount.
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, go]);

  useEffect(() => {
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const current = slides[index];
  return (
    <section
      className="hs"
      data-ready={hydrated}
      aria-roledescription="carousel"
      aria-label="Software I build"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={(e) => setFocused(isKeyboardFocus(e.target))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(e) => {
        // Arrow keys move the carousel only from the carousel's own controls, never from inside a demo.
        if (!(e.target instanceof Element) || !e.target.closest(".hs-top, .hs-dots")) return;
        if (e.key === "ArrowRight") go(1);
        else if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <div className="hs-intro">
        <h2>Showcasing what I can make</h2>
        <p>Android apps, desktop software, APIs, dashboards, finance tools and stores. Tap a demo to try it.</p>
      </div>
      <div className="hs-top">
        <p className="hs-badge" aria-hidden="true"><i />{current?.label}</p>
        <div className="hs-ctrl">
          <button type="button" onClick={() => go(-1)} aria-label="Previous slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button>
          <button
            type="button"
            onClick={() => {
              setEngaged(false);
              setUserPaused((p) => !p);
            }}
            aria-label={reduced ? "Automatic sliding is off (reduced motion)" : userPaused ? "Play automatic sliding" : "Pause automatic sliding"}
            aria-pressed={userPaused}
            disabled={reduced}
          >
            {userPaused || reduced ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>}
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next slide"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        </div>
      </div>

      <div
        className="hs-stage"
        data-no-fx
        style={{ "--dir": dir } as React.CSSProperties}
        aria-live={running ? "off" : "polite"}
        onClickCapture={() => setEngaged(true)}
        onPointerDown={(e) => {
          // Swipe between slides only when a touch starts on the empty frame, not on a demo control.
          const onControl = e.target instanceof Element && e.target.closest("button, input, select, a, [role='row']");
          if (e.pointerType === "touch" && !onControl) swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(dx < 0 ? 1 : -1);
        }}
      >
        {slides.map((s, i) => {
          const state = i === index ? "active" : i === leaving ? "leaving" : "off";
          return (
            <div
              key={s.id}
              className="hs-slide"
              data-state={state}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${s.label}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <p className="sr-only">{s.summary}</p>
              <div className="hs-art"><s.Component /></div>
            </div>
          );
        })}
      </div>

      <div className="hs-foot">
        <div className="hs-dots">
          {slides.map((s, i) => (
            <button key={s.id} type="button" onClick={() => goTo(i)} aria-label={`Show ${s.label}`} aria-current={i === index ? "true" : undefined}>
              <i key={`${index}-${running}`} className={i === index && running ? "run" : undefined} />
            </button>
          ))}
        </div>
        <p className="hs-note">Interactive demos with sample data</p>
      </div>
    </section>
  );
}
