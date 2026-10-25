import { SafeImage } from "@/components/site/SafeImage";
import Link from "next/link";
import type { Project, Settings, Skill, Testimonial } from "@/lib/schemas";
import { telHref, waHref } from "@/lib/contact";
import { ContactForm } from "@/components/site/ContactForm";
import { HeaderLinks } from "@/components/site/HeaderLinks";
import { HeroShowcase } from "@/components/showcase/HeroShowcase";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Typewriter } from "@/components/site/Typewriter";
import { techIcon } from "@/lib/techIcons";

const NAV = [["/work", "Work"], ["/skills", "Skills"], ["/about", "About"], ["/proof", "Proof"], ["/contact", "Contact"]] as const;
const emails = (s: Settings) => [s.email, s.email_2].filter((e): e is string => !!e);
const accent = (c: string) => ({ "--c": `var(--${c})` }) as React.CSSProperties;
const MARQUEE_A = ["Web", "Android", "Windows", "Backend", "Automation", "SEO"];
const MARQUEE_B = ["Billing", "Rates", "Dashboards", "Printing", "Analytics", "Launch"];
const SERVICE_ICONS = [
  <g key="biz"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></g>,
  <g key="web"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></g>,
  <g key="and"><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></g>,
  <path key="api" d="M4 7l5 5-5 5M12 18h8" />,
];

/** Line icon used by contact channels. */
function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}
const GLYPHS = {
  whatsapp: <Glyph><path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.3A8.5 8.5 0 1 1 20 11.5z" /><path d="M9 8.5c.3 2.7 2.8 5.2 5.5 5.5l1.2-1.3-2-1-1 .7a5 5 0 0 1-2.2-2.2l.7-1-1-2z" /></Glyph>,
  phone: <Glyph><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Glyph>,
  mail: <Glyph><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Glyph>,
  github: <Glyph><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></Glyph>,
  instagram: <Glyph><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></Glyph>,
};

/** Section title with an icon chip. On standalone pages (`bare`) the page header already shows the title, so it is visually hidden. */
function Head({ id, icon, title, lead, bare }: { id: string; icon: string; title: string; lead?: string; bare?: boolean }) {
  if (bare) return <h2 id={id} className="sr-only">{title}</h2>;
  return (
    <>
      <h2 id={id}><span className="ico" aria-hidden="true">{icon}</span>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </>
  );
}

export function Header() {
  return (
    <header className="top">
      <nav aria-label="Main">
        <Link className="logo" href="/">Ayush Aryal</Link>
        <HeaderLinks links={NAV} />
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function Hero({ s }: { s: Settings }) {
  return (
    <div className="wrap hero">
      <div>
        <div className="chips-row">
          {s.open_to_work && <div className="eyebrow"><i aria-hidden="true" />Open to new projects</div>}
          <div className="eyebrow"><span aria-hidden="true">📍</span>{s.location}</div>
        </div>
        <h1><span>{s.hero_line_1}</span><span>{s.hero_line_2}</span></h1>
        <p className="intro">{s.hero_intro}</p>
        <Typewriter />
        <div className="cta"><a className="btn main" href="#contact" data-magnetic>Start a project</a><a className="btn" href="#work">Explore my work</a>{s.github_url && <a className="btn" href={s.github_url} rel="noopener noreferrer">View GitHub</a>}</div>
        <a className="cue" href="#work">Scroll to explore<span aria-hidden="true">↓</span></a>
      </div>
      <HeroShowcase />
    </div>
  );
}

export function Marquee() {
  const row = (words: string[]) => [...words, ...words].map((w, i) => <span key={i}>{w}</span>);
  return (
    <div className="band" aria-hidden="true">
      <div>{row(MARQUEE_A)}</div>
      <div>{row(MARQUEE_B)}</div>
    </div>
  );
}

export function Skills({ skills, bare }: { skills: Skill[]; bare?: boolean }) {
  const services = skills.filter((s) => s.kind === "service");
  const groups = skills.filter((s) => s.kind === "tools");
  return (
    <section id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <Head id="skills-title" icon="🛠️" title="What I do best" lead="Business software people use all day. Pick a card to see a matching project." bare={bare} />
        <div className="skills">
          {services.map((s, i) => (
            <Link key={s.id} href={s.project_slug ? `/work#${s.project_slug}` : "/work"} data-project={s.project_slug ?? undefined} className="card sk" data-fx data-tilt="4" data-reveal style={{ ...accent(s.color), "--i": i } as React.CSSProperties}>
              <div className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{SERVICE_ICONS[i % SERVICE_ICONS.length]}</svg></div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              {s.best_for && <em>Best for: {s.best_for}</em>}
              {s.project_slug && <span className="go">See an example →</span>}
            </Link>
          ))}
        </div>
        {groups.length > 0 && (
          <div className="card langs" data-fx data-reveal>
            <h3><span aria-hidden="true">🧰 </span>Languages &amp; tools</h3>
            <dl>
              {groups.map((g) => (
                <div className="lg" key={g.id}>
                  <dt>{g.title}</dt>
                  <dd><ul className="tags" style={{ listStyle: "none", padding: 0 }}>{g.items.map((t) => <li className="tag tech" key={t}><span className="ti" aria-hidden="true">{techIcon(t)}</span>{t}</li>)}</ul></dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="card cta2" data-fx data-reveal>
          <div><h3>Have something in mind?</h3><p>Tell me the problem. I will tell you honestly if I can solve it.</p></div>
          <Link className="btn main" href="/contact" data-magnetic>Start a conversation</Link>
        </div>
      </div>
    </section>
  );
}

import { AboutStory } from "@/components/site/AboutStory";
import type { AboutChapter } from "@/lib/schemas";

export function About({ s, chapters, bare }: { s: Settings; chapters?: AboutChapter[]; bare?: boolean }) {
  return <AboutStory s={s} chapters={chapters} bare={bare} />;
}

export function Proof({ projects, testimonials, bare }: { projects: Project[]; testimonials: Testimonial[]; bare?: boolean }) {
  return (
    <section id="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <Head id="proof-title" icon="✅" title="Proof it works" lead="Real software, running in a real business every day." bare={bare} />
        <div className="stats">
          <div className="card stat" data-fx data-tilt="3" data-reveal style={{ "--i": 0 } as React.CSSProperties}><b>1</b>live business on my software</div>
          <div className="card stat" data-fx data-tilt="3" data-reveal style={{ "--i": 1 } as React.CSSProperties}><b>3</b>platforms: web, Windows, Android</div>
          <div className="card stat" data-fx data-tilt="3" data-reveal style={{ "--i": 2 } as React.CSSProperties}><b>{projects.length}</b>projects documented</div>
        </div>
        <div className="card cta2" data-fx data-reveal>
          <div><h3><span aria-hidden="true">🚚 </span>Used in production</h3><p>The BC Cargo &amp; Courier Service, Hetauda: website, Android app, billing software and analytics, used by staff and customers every day.</p></div>
          <Link className="btn" href="/work">See the project</Link>
        </div>
        {testimonials.length > 0 && (
          <div className="quotes">
            {testimonials.map((t) => (
              <figure className="quote" key={t.id}>
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>{t.name}{t.role ? `, ${t.role}` : ""}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type Channel = { key: string; label: string; value: string; action: string; href: string; color: string; icon: React.ReactNode; external?: boolean };

function channelsOf(s: Settings): Channel[] {
  return [
    ...(s.whatsapp ? [{ key: "wa", label: "WhatsApp", value: s.whatsapp, action: "Chat", href: waHref(s.whatsapp), color: "teal", icon: GLYPHS.whatsapp, external: true }] : []),
    ...(s.phone ? [{ key: "tel", label: "Phone", value: s.phone, action: "Call", href: telHref(s.phone), color: "blue", icon: GLYPHS.phone }] : []),
    ...emails(s).map((e, i) => ({ key: `mail${i}`, label: i === 0 ? "Email" : "Alternate email", value: e, action: "Write", href: `mailto:${e}`, color: "orange", icon: GLYPHS.mail })),
    ...(s.github_url ? [{ key: "gh", label: "GitHub", value: s.github_url.replace("https://", ""), action: "Open", href: s.github_url, color: "blue", icon: GLYPHS.github, external: true }] : []),
    ...(s.instagram_url ? [{ key: "ig", label: "Instagram", value: s.instagram_url.replace("https://", ""), action: "Follow", href: s.instagram_url, color: "pink", icon: GLYPHS.instagram, external: true }] : []),
  ];
}

/** Social apps + contact form in one section: direct channels on the left, message form on the right. */
export function Connect({ s, bare }: { s: Settings; bare?: boolean }) {
  const channels = channelsOf(s);
  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <Head id="contact-title" icon="💬" title="Get in touch" lead="Tell me the problem. I will say honestly if I can solve it and how long it takes." bare={bare} />
        <div className="connect">
          {channels.length > 0 && (
            <div>
              <h3 className="sub">Reach me directly</h3>
              <ul className="channels">
                {channels.map((c, i) => (
                  <li key={c.key} style={{ "--i": i } as React.CSSProperties}>
                    <a className="channel" data-fx data-tilt="3" data-reveal href={c.href} style={accent(c.color)} {...(c.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}>
                      <span className="ch-ico" aria-hidden="true">{c.icon}</span>
                      <span className="ch-body"><strong>{c.label}</strong><span>{c.value}</span></span>
                      <span className="ch-go">{c.action}<span className="sr-only">{c.external ? " (opens in a new tab)" : ""}</span></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card form-card" data-fx data-reveal>
            <h3>Send a message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ s }: { s: Settings }) {
  return (
    <footer>
      <div className="wrap">
        <div className="fgrid">
          <div className="fb"><Link className="logo" href="/">Ayush Aryal</Link><p>Software builder in {s.location}. Websites, Android apps and billing systems that businesses use every day.</p></div>
          <div><h2>Explore</h2>{NAV.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}</div>
          <div><h2>Connect</h2>{channelsOf(s).map((c) => <a key={c.key} href={c.href} {...(c.external ? { rel: "noopener noreferrer" } : {})}>{c.label === "Phone" ? c.value : c.label === "Email" || c.label === "Alternate email" ? c.value : c.label}</a>)}</div>
        </div>
        <div className="fbot"><span>© {new Date().getFullYear()} Ayush Aryal · {s.location}</span><a className="btn" href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
