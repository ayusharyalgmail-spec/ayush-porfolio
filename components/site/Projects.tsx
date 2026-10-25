"use client";

import { SafeImage } from "@/components/site/SafeImage";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "@/lib/schemas";

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);
const REDUCED = "(prefers-reduced-motion: reduce), (max-width: 860px)";

function useStacked() {
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

/** Sticky scroll-driven showcase on wide screens; a plain stacked list on phones and with reduced motion. */
export function Projects({ projects, priorityFirst = false }: { projects: Project[]; priorityFirst?: boolean }) {
  const n = projects.length;
  const stacked = useStacked();
  const track = useRef<HTMLElement>(null);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const [nav, setNav] = useState({ index: 0, leaving: -1, dir: 1 }); // leaving + dir drive the directional slide
  const { index, leaving, dir } = nav;

  const goTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      if (stacked) {
        document.getElementById(`project-${projects[i]?.slug}`)?.scrollIntoView({ block: "start" });
        return;
      }
      const top = el.getBoundingClientRect().top + scrollY;
      scrollTo({ top: top + (el.offsetHeight - innerHeight) * ((i + 0.5) / n), behavior: "smooth" });
    },
    [n, stacked, projects],
  );

  useEffect(() => {
    const el = track.current;
    if (!el || n === 0 || stacked) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const t = -r.top / Math.max(1, r.height - innerHeight);
      const i = Math.floor(clamp(t, 0, 0.9999) * n);
      setNav((s) => (s.index === i ? s : { index: i, leaving: s.index, dir: i > s.index ? 1 : -1 }));
      const done = clamp(t) * n;
      segs.current.forEach((s, i) => {
        if (!s) return;
        const v = clamp(done - i);
        s.style.setProperty("--v", String(v));
        s.classList.toggle("done", v > 0);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, stacked]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-project]");
      if (!link || !document.getElementById("work")) return;
      const i = projects.findIndex((p) => p.slug === link.dataset.project);
      if (i < 0) return;
      e.preventDefault();
      goTo(i);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [projects, goTo]);

  const hashHandled = useRef(false);
  useEffect(() => {
    if (hashHandled.current) return;
    const i = projects.findIndex((p) => p.slug === decodeURIComponent(location.hash.slice(1)));
    hashHandled.current = true;
    if (i < 0) return;
    const t = window.setTimeout(() => goTo(i), 150);
    return () => window.clearTimeout(t);
  }, [projects, goTo]);

  if (n === 0) return null;
  const current = projects[index] ?? projects[0]!;
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section
      className={`track${stacked ? " stacked" : ""}`}
      id="work"
      ref={track}
      style={stacked ? undefined : { height: `${n * 45 + 25}svh` }}
      aria-labelledby="work-title"
    >
      <div className="stage" style={{ "--accent": `var(--${current.color})` } as React.CSSProperties}>
        <div className="idx">
          <h2 id="work-title"><span className="ico" aria-hidden="true">🚀</span>Projects</h2>
          <nav aria-label="Project picker" style={{ display: "contents" }}>
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="pick"
                style={{ "--c": `var(--${p.color})` } as React.CSSProperties}
                aria-current={!stacked && i === index ? "true" : undefined}
                onClick={() => goTo(i)}
              >
                <i aria-hidden="true" />
                {p.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="view">
          <div className="meter" aria-hidden="true">
            <span className="cnt">{pad(index + 1)}</span>
            <small>/ {pad(n)}</small>
            <div className="segs">
              {projects.map((p, i) => (
                <span key={p.id} ref={(el) => { segs.current[i] = el; }}>
                  <b />
                </span>
              ))}
            </div>
          </div>
          <div className="txt" style={{ "--pdir": dir } as React.CSSProperties}>
            {projects.map((p, i) => {
              const active = stacked || i === index;
              return (
                <article
                  key={p.id}
                  id={`project-${p.slug}`}
                  className={active ? "pn on" : i === leaving ? "pn out" : "pn"}
                  style={{ "--accent": `var(--${p.color})` } as React.CSSProperties}
                  inert={!active}
                  aria-label={p.name}
                >
                  <div className="pv" data-fx data-tilt="3">
                  {p.image_url ? (
                    <SafeImage className="pi" src={p.image_url} alt={`${p.name} screenshot`} width={1280} height={720} sizes="(max-width: 860px) 100vw, 760px" quality={85} priority={priorityFirst && i === 0} />
                  ) : (
                    <div className="pi ph" aria-hidden="true">{initials(p.name)}</div>
                  )}
                  {p.tags[0] && <span className="pv-chip" aria-hidden="true">{p.tags[0]}</span>}
                  <span className="pv-sheen" aria-hidden="true" />
                  </div>
                  <h3>{p.name}</h3>
                  <p className="tagline"><strong>{p.tagline}</strong></p>
                  {p.role && <p className="role-line"><span>My role</span> {p.role}</p>}
                  <p className="desc">{p.description}</p>
                  {p.features.length > 0 && (
                    <ul className="feat">
                      {p.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <ul className="tags" style={{ listStyle: "none", padding: 0 }}>
                    {p.tags.map((t) => (
                      <li key={t} className="tag">{t}</li>
                    ))}
                  </ul>
                  {p.live_url && (
                    <a className="btn main" data-magnetic href={p.live_url} target="_blank" rel="noopener noreferrer">
                      Visit live site<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
