"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/schemas";
import "./about.css";

type Chapter = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  text: string[];
  theme: "cosmic" | "code" | "experiment" | "product" | "vision";
  stats: { label: string; val: string }[];
};

const CHAPTERS: Chapter[] = [
  {
    id: "origin",
    badge: "01 / ORIGIN & CURIOSITY",
    title: "Curiosity Made Me a Builder",
    subtitle: "NRVM School · Simara, Nepal",
    text: [
      "I am a Grade 12 student at NRVM in Simara, Nepal. Long before I wrote my first line of code, my head was in the cosmos — fascinated by space science, physics, and how invisible systems keep galaxies and machines in balance.",
      "That curiosity evolved into a relentless drive to understand not just how technologies work, but how to construct them from first principles."
    ],
    theme: "cosmic",
    stats: [
      { label: "Location", val: "Simara, Nepal" },
      { label: "Education", val: "Grade 12, NRVM" },
      { label: "Foundation", val: "Space & Physics" }
    ]
  },
  {
    id: "first-code",
    badge: "02 / THE INITIATION",
    title: "First Steps into Code",
    subtitle: "Grade 7 · CodeWithHarry & My Father's Spark",
    text: [
      "In Grade 7, I stumbled upon CodeWithHarry tutorials. Suddenly, logic replaced theory. Soon after, my father introduced me to HTML, revealing the magical ability to write characters in a text file and watch them render as interactive documents.",
      "The realization that a kid in Nepal with an internet connection could build for the world changed everything."
    ],
    theme: "code",
    stats: [
      { label: "Started", val: "Grade 7" },
      { label: "First Spark", val: "HTML & Web" },
      { label: "Mentor", val: "Dad & CodeWithHarry" }
    ]
  },
  {
    id: "experimentation",
    badge: "03 / TRIAL BY FIRE",
    title: "Reverse Engineering & Exploits",
    subtitle: "Grade 10 · Systems, Memory & Logic",
    text: [
      "By Grade 10, textbook exercises were not enough. I began analyzing Free Fire game scripts, dissecting client-server communication, memory patterns, and modding tools.",
      "It taught me what schools never cover: how runtime environments actually execute, how vulnerabilities emerge, and why secure, resilient engineering matters."
    ],
    theme: "experiment",
    stats: [
      { label: "Discipline", val: "Memory & Scripts" },
      { label: "Mindset", val: "Deconstruct & Rebuild" },
      { label: "Key Lesson", val: "Resilient Security" }
    ]
  },
  {
    id: "real-world",
    badge: "04 / PRODUCTION SOFTWARE",
    title: "Shipping for Real Businesses",
    subtitle: "Full-Stack & Desktop · The BC Cargo & Courier",
    text: [
      "I transitioned into software development, specializing in modern full-stack web and .NET desktop architectures. When The BC Cargo & Courier needed digitizing, I stepped in as sole developer.",
      "I engineered their public web portal, cross-platform Android mobile app, and a WinUI desktop billing system with thermal printing, rate calculating, and Google Sheets sync used by staff daily."
    ],
    theme: "product",
    stats: [
      { label: "Core Stack", val: ".NET · Next.js · Supabase" },
      { label: "Live Client", val: "The BC Cargo & Courier" },
      { label: "Impact", val: "Daily Ops & Billing" }
    ]
  },
  {
    id: "marketplace-vision",
    badge: "05 / THE FUTURE ECOSYSTEM",
    title: "The Multi-Vendor SaaS Marketplace",
    subtitle: "A Connected Ecosystem for Digital Creators",
    text: [
      "My mission is to architect an open digital marketplace where independent software creators and business vendors trade turnkey solutions seamlessly.",
      "Every merchant gets a dedicated storefront on their custom sub-URL, an automated checkout engine, dynamic project access, and a unified telemetry dashboard."
    ],
    theme: "vision",
    stats: [
      { label: "Architecture", val: "Multi-Tenant Cloud" },
      { label: "Deployment", val: "Unique Subdomain URLs" },
      { label: "Feature", val: "Autonomous Dashboards" }
    ]
  }
];

export function AboutStory({ s, bare }: { s: Settings; bare?: boolean }) {
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
  }, []);

  // 3D Card Interactive Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: -(y * 14),
      ry: x * 14
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const activeChapter = CHAPTERS[activeIdx] ?? CHAPTERS[0]!;

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
              <span className="text-white">Curiosity made me </span>
              <span className="luminous-text">a builder.</span>
            </h2>
            <p className="story-lead">
              From dissecting code in Grade 7 to architecting enterprise desktop billing, cloud APIs, and multi-tenant platforms.
              Scroll down to explore each milestone.
            </p>
          </header>
        )}

        {/* 2-Column Responsive Layout: Sticky Profile Card (Left) & Dynamic Chapters (Right) */}
        <div className="story-grid">
          {/* LEFT: 3D Holographic Profile Stage */}
          <aside className="story-profile-col">
            <div
              ref={cardRef}
              className="profile-3d-card"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
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
                <div className="avatar-status-badge" title="Active & Ready to Build">
                  <span className="status-dot" aria-hidden="true" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Identity & Origin */}
              <div className="profile-info">
                <h3 className="profile-name">Ayush Aryal</h3>
                <p className="profile-tagline">{s.role_line || "Full-Stack Software Engineer"}</p>
                <div className="profile-meta-chips">
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {s.location || "Simara / Hetauda, Nepal"}
                  </span>
                  <span className="meta-chip highlight">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Grade 12 · NRVM
                  </span>
                </div>
              </div>

              {/* Dynamic Chapter Progress Tracker */}
              <div className="story-stepper">
                <div className="stepper-header">
                  <span className="stepper-title">CHAPTER PROGRESS</span>
                  <span className="stepper-counter">0{activeIdx + 1} / 0{CHAPTERS.length}</span>
                </div>
                <div className="stepper-bars">
                  {CHAPTERS.map((ch, idx) => (
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
                  Let&apos;s Build Together
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
            {CHAPTERS.map((chapter, idx) => (
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
                      <div className="stardust" />
                    </div>
                  )}

                  {chapter.theme === "code" && (
                    <div className="art-code-terminal">
                      <div className="terminal-header">
                        <span className="t-dot red" />
                        <span className="t-dot yellow" />
                        <span className="t-dot green" />
                        <span className="t-title">init_developer.ts</span>
                      </div>
                      <pre className="terminal-body">
                        <code>
                          <span className="c-dim">// 2018 · CodeWithHarry</span>{"\n"}
                          <span className="c-kw">const</span> student = <span className="c-str">&quot;Ayush Aryal&quot;</span>;{"\n"}
                          <span className="c-kw">const</span> father = <span className="c-fn">introduceHTML</span>();{"\n"}
                          <span className="c-kw">await</span> student.<span className="c-fn">buildWebPage</span>();
                        </code>
                      </pre>
                    </div>
                  )}

                  {chapter.theme === "experiment" && (
                    <div className="art-experiment">
                      <div className="circuit-board">
                        <div className="chip-core">
                          <span>RAM</span>
                        </div>
                        <div className="data-trace trace-1" />
                        <div className="data-trace trace-2" />
                        <div className="hex-stream">0x7FFE9A4B · BYPASS_HOOK · REVERSE_ENG</div>
                      </div>
                    </div>
                  )}

                  {chapter.theme === "product" && (
                    <div className="art-product-preview">
                      <div className="preview-window">
                        <div className="window-bar">
                          <span className="window-tag">The BC Cargo Courier System</span>
                          <span className="window-status">ONLINE 24/7</span>
                        </div>
                        <div className="window-content">
                          <div className="app-metric">
                            <span className="metric-title">Waybills Processed</span>
                            <span className="metric-val">100% Thermal Print</span>
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
                        <div className="panel-url">https://vendor.ayush.dev</div>
                      </div>
                      <div className="floating-panel panel-dashboard">
                        <div className="panel-badge">AUTONOMOUS DASHBOARD</div>
                        <div className="panel-graph" />
                      </div>
                      <div className="floating-panel panel-cart">
                        <div className="panel-badge">INSTANT CHECKOUT</div>
                        <div className="panel-sub">PROJECT LICENSED</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chapter Story Narrative */}
                <div className="chapter-body">
                  <div className="chapter-badge-row">
                    <span className="chapter-badge">{chapter.badge}</span>
                    <span className="chapter-subtitle">{chapter.subtitle}</span>
                  </div>

                  <h3 className="chapter-title">{chapter.title}</h3>

                  <div className="chapter-paragraphs">
                    {chapter.text.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Concrete stats/metadata chips */}
                  <div className="chapter-stats-grid">
                    {chapter.stats.map((st, sIdx) => (
                      <div key={sIdx} className="stat-pill">
                        <span className="stat-label">{st.label}</span>
                        <strong className="stat-val">{st.val}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </main>
        </div>
      </div>
    </section>
  );
}
