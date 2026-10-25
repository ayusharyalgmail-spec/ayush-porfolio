import type { Project, Settings, Skill, Testimonial } from "@/lib/schemas";

/** Fallback content used when Supabase is not configured or unreachable. Mirrors supabase/migrations/0001_init.sql. */
export const seedSettings: Settings = {
  location: "Hetauda, Nepal",
  role_line: "Software builder · Hetauda, Nepal",
  hero_line_1: "I build software",
  hero_line_2: "businesses run on.",
  hero_intro:
    "I build software that helps businesses operate smarter — from websites and Android apps to custom dashboards, backend systems, and automation.",
  open_to_work: true,
  email: "ayushytaryal@gmail.com",
  email_2: "ayusharyalgmail@gmail.com",
  phone: "9823716862",
  whatsapp: "9823716862",
  github_url: null,
  instagram_url: null,
  about_1:
    "I started with school projects and moved to production software for The BC Cargo & Courier Service, a family courier business in Hetauda. I built its website, Android app, billing software and analytics myself.",
  about_2:
    "I use AI coding tools, but I direct the design and check the code. My rule: inspect first, change carefully, test, then report exactly what changed.",
  photo_url: "/profile.webp",
};

const p = (n: number, x: Omit<Project, "id" | "sort_order" | "published" | "image_url" | "live_url" | "role" | "features"> & Partial<Pick<Project, "image_url" | "live_url" | "role" | "features">>): Project => ({
  id: `00000000-0000-4000-8000-00000000000${n}`,
  sort_order: n,
  published: true,
  image_url: null,
  live_url: null,
  role: null,
  features: [],
  ...x,
});

export const seedProjects: Project[] = [
  p(1, {
    slug: "the-bc-cargo",
    features: ["Interactive destination globe", "Air, road, sea and customs services", "Parcel tracking by tracking number", "Price estimates", "AI assistant limited to an approved knowledge base", "WinUI billing app with bill printing", "Android app"],
    name: "The BC Cargo",
    tagline: "Billing, rates and a public site for an international courier in Hetauda.",
    description:
      "Website for BC Cargo & Courier, shipping from Hetauda to 190+ countries: an interactive destination globe, air, road, sea and customs services, parcel tracking, price estimates and a knowledge-base AI assistant. Plus a WinUI billing app with bill printing, an Android app and the backend behind them. Prices load from a Google Sheet, so staff change rates without touching code.",
    tags: ["Next.js", "WinUI + C#", "Android", "Supabase", "Google Sheets", "Tracking"],
    color: "blue",
    image_url: "/projects/the-bc-cargo.webp",
    live_url: "https://thebccargo.com",
    role: "Sole developer: website, Windows billing app, Android app and backend",
  }),
  p(2, {
    slug: "datewithstranger",
    features: ["Filters by gender, language, country and interests", "Photo, video, voice, GIF and sticker sharing", "Report system with auto-ban", "Live user stats on the landing site"],
    name: "DateWithStranger",
    tagline: "A free anonymous chat bot on Telegram, with its own landing site.",
    description:
      "Anonymous chat bot on Telegram that matches strangers worldwide, free and with no sign-up. Users can filter by gender, language, country and interests, share photos, video, voice notes, GIFs and stickers, and report abuse (repeat reports trigger an auto-ban). The public site shows live user stats, how it works, a comparison table and an FAQ, and lists 2,000+ users. Being moved from a legacy Mongo database to Supabase, with profiles, profile pictures, webhooks and several interface languages.",
    tags: ["Telegram bot", "Supabase", "Webhooks", "Multilingual", "Render"],
    color: "pink",
    image_url: "/projects/datewithstranger.webp",
    live_url: "https://datestranger-bot.onrender.com/",
  }),
  p(3, {
    slug: "lm-arena-api",
    features: ["Automates LM Arena with Playwright", "Keeps logs and handles errors", "Tests itself to surface problems"],
    name: "LM Arena API",
    tagline: "A chat-style site driven by its own backend API.",
    description:
      "The backend automates LM Arena with Playwright, keeps logs, handles errors and tests itself, so problems surface without manual hunting.",
    tags: ["Playwright", "Backend API", "Logging", "Auto-tests"],
    color: "teal",
  }),
  p(4, {
    slug: "arduino-control",
    features: ["Switches a light and a fan from a phone", "HC-05 Bluetooth link with a relay board", "Small Java Android app"],
    name: "Arduino control",
    tagline: "Switch a light and a fan from a phone over Bluetooth.",
    description:
      "An Arduino Uno, an HC-05 module and a relay board, paired with a small Java Android app. It taught me how hardware, code and a phone fit together.",
    tags: ["Arduino", "HC-05", "Relay", "Java"],
    color: "orange",
  }),
];

const s = (n: number, x: Omit<Skill, "id" | "sort_order" | "published">): Skill => ({
  id: `00000000-0000-4000-8000-0000000001${n.toString().padStart(2, "0")}`,
  sort_order: n,
  published: true,
  ...x,
});
const svc: Pick<Skill, "kind" | "items"> = { kind: "service", items: [] };
const grp: Pick<Skill, "kind" | "description" | "best_for" | "project_slug"> = { kind: "tools", description: null, best_for: null, project_slug: null };

export const seedSkills: Skill[] = [
  s(1, { ...svc, title: "Business software", description: "Billing, rate calculators, printing and dashboards that replace paper and spreadsheets.", best_for: "shops, couriers, offices", project_slug: "the-bc-cargo", color: "blue" }),
  s(2, { ...svc, title: "Websites & web apps", description: "Fast, clean sites in React and Next.js, with live data and SEO from day one.", best_for: "company and service sites", project_slug: "the-bc-cargo", color: "pink" }),
  s(3, { ...svc, title: "Android apps", description: "Simple phone apps for staff and customers, connected to the same backend as the website.", best_for: "field staff, tracking, forms", project_slug: "arduino-control", color: "teal" }),
  s(4, { ...svc, title: "Backend & automation", description: "Supabase databases, bots, APIs and scripts that remove repeated manual work.", best_for: "bots, integrations, reports", project_slug: "lm-arena-api", color: "orange" }),
  s(11, { ...grp, title: "Use most", items: ["JavaScript", "TypeScript", "C#"], color: "blue" }),
  s(12, { ...grp, title: "Comfortable with", items: ["Java", "Python", "SQL", "HTML & CSS"], color: "blue" }),
  s(13, { ...grp, title: "Frameworks & tools", items: ["React", "Next.js", "WinUI", "Supabase", "Playwright"], color: "blue" }),
  s(14, { ...grp, title: "Hardware", items: ["Arduino C++"], color: "blue" }),
];

export const seedTestimonials: Testimonial[] = [];
