"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AboutChapter, Settings } from "@/lib/schemas";
import { seedAboutChapters } from "@/lib/seed";
import "./about.css";

export function AboutStory({
  s,
  chapters,
  bare,
}: {
  s: Settings;
  chapters?: AboutChapter[];
  bare?: boolean;
}) {
  const activeChapters = (chapters && chapters.length > 0 ? chapters : seedAboutChapters).filter(
    (c) => c.published !== false
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const observerRefs = useRef<(HTMLElement | null)[]>([]);

  // Track scroll through chapters using IntersectionObserver
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const elements = observerRefs.current.filter(Boolean) as HTMLElement[];

    if (elements.length > 0) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.getAttribute("data-chapter-idx"));
              if (!Number.isNaN(idx)) {
                setActiveIdx(idx);
              }
            }
          });
        },
        { threshold: 0.45, rootMargin: "-10% 0px -25% 0px" }
      );

      elements.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, [activeChapters.length]);

  // 3D Card Interactive Tilt (with pointer-fine check)
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -(y * 12),
      ry: x * 12,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const activeChapter = activeChapters[activeIdx] ?? activeChapters[0]!;

  return (
    <section id="about" className="about-experience" aria-labelledby="about-title">
      <div className="wrap">
        {/* Editorial Section Header */}
        {!bare && (
          <header className="story-header" data-reveal>
            <div className="story-kicker">
              <span className="pulse-orb" aria-hidden="true" />
              <span>THE INTERACTIVE JOURNEY</span>
            </div>
            <h2 id="about-title" className="story-headline">
              <span className="story-title-dark">{s.about_heading || "Curiosity made me a builder."}</span>
            </h2>
            <p className="story-lead">
              {s.about_lead ||
                "I am an 18-year-old student at NRVM in Simara, Nepal, exploring software development, .NET, desktop, and mobile applications."}
            </p>
          </header>
        )}

        {/* 2-Column Responsive Layout: Sticky Profile Card (Left) & Dynamic Chapters (Right) */}
        <div className="story-grid">
          {/* LEFT: 3D Profile Stage */}
          <aside className="story-profile-col">
            <div
              ref={cardRef}
              className="profile-3d-card"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
            >
              {/* Atmospheric Backglow */}
              <div className="card-ambient-glow" aria-hidden="true" />

              {/* Avatar Frame with Cyber Ring */}
              <div className="avatar-frame">
                <div className="avatar-ring-pulse" aria-hidden="true" />
                <div className="avatar-inner">
                  {s.photo_url ? (
                    <Image
                      src={s.photo_url}
                      alt="Ayush Aryal"
                      width={180}
                      height={180}
                      className="avatar-img"
                      priority
                    />
                  ) : (
                    <span className="avatar-fallback">AA</span>
                  )}
                </div>
                <div className="avatar-status-badge" title="Active & Ready to Learn">
                  <span className="status-dot" aria-hidden="true" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Identity & Origin */}
              <div className="profile-info">
                <h3 className="profile-name">Ayush Aryal</h3>
                <p className="profile-tagline">{s.role_line || "Grade 12 Student · Software Explorer"}</p>
                <div className="profile-meta-chips">
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {s.location || "Simara, Nepal"}
                  </span>
                  <span className="meta-chip highlight">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {s.age ? `${s.age} y/o · Grade 12` : "Grade 12 · NRVM"}
                  </span>
                </div>
              </div>

              {/* Dynamic Chapter Progress Tracker */}
              <div className="story-stepper">
                <div className="stepper-header">
                  <span className="stepper-title">CHAPTER PROGRESS</span>
                  <span className="stepper-counter">
                    0{activeIdx + 1} / 0{activeChapters.length}
                  </span>
                </div>
                <div className="stepper-bars">
                  {activeChapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      type="button"
                      aria-label={`Jump to ${ch.title}`}
                      className={`stepper-bar-btn ${idx === activeIdx ? "active" : ""} ${idx < activeIdx ? "done" : ""}`}
                      onClick={() => {
                        observerRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      <span className="bar-fill" />
                    </button>
                  ))}
                </div>
                <div className="current-chapter-pill">
                  <span className="pill-dot" />
                  <span className="pill-text">{activeChapter.title}</span>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="profile-actions">
                <Link href="#contact" className="btn main btn-full" data-magnetic>
                  Start a conversation
                </Link>
                {s.github_url && (
                  <a
                    href={s.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-full"
                  >
                    View GitHub
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT: Scroll-Driven Visual Narrative Chapters */}
          <main className="story-chapters-col">
            {activeChapters.map((chapter, idx) => (
              <article
                key={chapter.id}
                ref={(el) => {
                  observerRefs.current[idx] = el;
                }}
                data-chapter-idx={idx}
                className={`chapter-card ${chapter.theme} ${activeIdx === idx ? "active-viewport" : ""}`}
              >
                {/* Visual Atmosphere Layer corresponding to story */}
                <div className="chapter-art-wrapper" aria-hidden="true">
                  {chapter.theme === "cosmic" && (
                    <div className="art-cosmic">
                      <div className="orbit orbit-1" />
                      <div className="orbit orbit-2" />
                      <div className="celestial-node node-1" />
                      <div className="celestial-node node-2" />
                      <span className="cosmic-caption">Space Science · Universe &amp; Physics</span>
                    </div>
                  )}

                  {chapter.theme === "code" && (
                    <div className="art-code-terminal">
                      <div className="terminal-header">
                        <span className="t-dot red" />
                        <span className="t-dot yellow" />
                        <span className="t-dot green" />
                        <span className="t-title">first_steps.html</span>
                      </div>
                      <pre className="terminal-body">
                        <code>
                          <span className="c-dim">&lt;!-- Grade 7 · CodeWithHarry &amp; Dad --&gt;</span>{"\n"}
                          <span className="c-kw">&lt;h1&gt;</span>Hello World<span className="c-kw">&lt;/h1&gt;</span>{"\n"}
                          <span className="c-dim">&lt;!-- Discovered building for the web --&gt;</span>
                        </code>
                      </pre>
                    </div>
                  )}

                  {chapter.theme === "experiment" && (
                    <div className="art-experiment">
                      <div className="circuit-board">
                        <div className="chip-core">
                          <span>.NET · Memory &amp; APIs</span>
                        </div>
                        <div className="hex-stream">AOB SCAN · KEYAUTH INTEGRATION · RUNTIME LOGIC</div>
                      </div>
                    </div>
                  )}

                  {chapter.theme === "product" && (
                    <div className="art-product-preview">
                      <div className="preview-window">
                        <div className="window-bar">
                          <span className="window-tag">The BC Cargo &amp; Courier Systems</span>
                          <span className="window-status">Focus Collaboration</span>
                        </div>
                        <div className="window-content">
                          <div className="app-metric">
                            <span className="metric-title">Scope of Work</span>
                            <span className="metric-val">Website · Billing Logic · Admin</span>
                          </div>
                          <div className="app-bars">
                            <div className="mini-bar b1" />
                            <div className="mini-bar b2" />
                            <div className="mini-bar b3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {chapter.theme === "vision" && (
                    <div className="art-3d-marketplace">
                      <div className="floating-panel panel-storefront">
                        <div className="panel-badge">VENDOR STOREFRONT</div>
                        <div className="panel-url">vendor.project.domain</div>
                      </div>
                      <div className="floating-panel panel-dashboard">
                        <div className="panel-badge">PRODUCT MANAGEMENT</div>
                        <div className="panel-sub">DEDICATED DASHBOARD</div>
                      </div>
                      <div className="floating-panel panel-cart">
                        <div className="panel-badge">PROJECT ACCESS</div>
                        <div className="panel-sub">DIRECT CLIENT URL</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapter Story Narrative */}
                <div className="chapter-body">
                  <div className="chapter-badge-row">
                    <span className="chapter-badge">{chapter.badge}</span>
                    {chapter.subtitle && <span className="chapter-subtitle">{chapter.subtitle}</span>}
                  </div>

                  <h3 className="chapter-title">{chapter.title}</h3>

                  <div className="chapter-paragraphs">
                    {chapter.paragraphs
                      .split(/\r?\n\r?\n/)
                      .filter(Boolean)
                      .map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                  </div>

                  {/* Concrete tech tags & metadata */}
                  {chapter.tech_tags && chapter.tech_tags.length > 0 && (
                    <div className="chapter-tags-row">
                      {chapter.tech_tags.map((tag) => (
                        <span key={tag} className="chapter-tech-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Concrete stats/metadata chips if available */}
                  {(chapter.stat_label_1 || chapter.stat_label_2) && (
                    <div className="chapter-stats-grid">
                      {chapter.stat_label_1 && (
                        <div className="stat-pill">
                          <span className="stat-label">{chapter.stat_label_1}</span>
                          <strong className="stat-val">{chapter.stat_val_1}</strong>
                        </div>
                      )}
                      {chapter.stat_label_2 && (
                        <div className="stat-pill">
                          <span className="stat-label">{chapter.stat_label_2}</span>
                          <strong className="stat-val">{chapter.stat_val_2}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}
