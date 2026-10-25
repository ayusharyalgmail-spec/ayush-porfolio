import type { AboutChapter, Project, Settings, Skill, Testimonial } from "@/lib/schemas";

/** Fallback content used when Supabase is not configured or unreachable. Mirrors supabase/migrations/0001_init.sql and 0005_about_chapters.sql. */
export const seedSettings: Settings = {
  location: "Simara, Nepal",
  role_line: "Grade 12 Student · Software Explorer",
  hero_line_1: "I build software",
  hero_line_2: "and explore code.",
  hero_intro:
    "18-year-old Grade 12 student at NRVM in Simara, Nepal. Learning and building applications with .NET, desktop systems, and web technologies.",
  open_to_work: true,
  email: "ayushytaryal@gmail.com",
  email_2: "ayusharyalgmail@gmail.com",
  phone: "9823716862",
  whatsapp: "9823716862",
  github_url: null,
  instagram_url: null,
  about_heading: "Curiosity made me a builder.",
  about_lead: "I am an 18-year-old student at NRVM in Simara, Nepal, exploring software development, .NET, desktop, and mobile applications.",
  age: "18",
  about_1:
    "I am an 18-year-old Grade 12 student at NRVM in Simara, Nepal, with a strong interest in technology, software, computers, networking, and AI. I enjoy exploring how software works and learning to build applications, particularly with .NET, desktop development, and mobile app development.",
  about_2:
    "Before I started coding, I was fascinated by space science and enjoyed learning about the universe, physics, and how things work.",
  photo_url: "/profile.webp",
};

export const seedAboutChapters: AboutChapter[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    badge: "01 / THE BEGINNING",
    title: "Curiosity Made Me a Builder",
    subtitle: "Grade 12 Student · NRVM, Simara",
    theme: "cosmic",
    paragraphs:
      "I am an 18-year-old Grade 12 student at NRVM in Simara, Nepal, with a strong interest in technology, software, computers, networking, and AI. I enjoy exploring how software works and learning to build applications, particularly with .NET, desktop development, and mobile app development.\n\nBefore I started coding, I was fascinated by space science and enjoyed learning about the universe, physics, and how things work.",
    tech_tags: ["Space Science", "Physics", ".NET", "Computer Science"],
    stat_label_1: "Age",
    stat_val_1: "18 Years Old",
    stat_label_2: "School",
    stat_val_2: "NRVM, Simara",
    sort_order: 1,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    badge: "02 / FIRST EXPOSURE",
    title: "My First Steps into Code",
    subtitle: "Grade 7 · CodeWithHarry & My Father",
    theme: "code",
    paragraphs:
      "In Grade 7, I started learning programming through CodeWithHarry's YouTube tutorials. My father introduced me to HTML, which helped me understand how a simple text file could become a webpage.\n\nThat was the beginning of my coding journey. I started exploring more, learning new concepts, and gradually developing a deeper interest in programming and software development.",
    tech_tags: ["HTML", "CSS", "YouTube Tutorials", "Web Basics"],
    stat_label_1: "Started",
    stat_val_1: "Grade 7",
    stat_label_2: "First Spark",
    stat_val_2: "Father introduced HTML",
    sort_order: 2,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    badge: "03 / EXPERIMENTATION",
    title: "Exploring Memory, APIs, and .NET",
    subtitle: "Grade 10 · Practical Logic & Systems",
    theme: "experiment",
    paragraphs:
      "By Grade 10, I was exploring programming beyond the basics. I started experimenting with Free Fire-related desktop cheats built with .NET, including memory manipulation, AOB (Array of Bytes) scanning, and understanding how applications interact with APIs.\n\nI also explored KeyAuth integration and learned more about application behavior, memory, and the logic behind these tools. These experiments helped me improve my practical programming knowledge and understand concepts that I wanted to explore further.",
    tech_tags: [".NET", "Memory Manipulation", "AOB Scanning", "APIs", "KeyAuth"],
    stat_label_1: "Focus",
    stat_val_1: "Memory & APIs",
    stat_label_2: "Platform",
    stat_val_2: ".NET Desktop",
    sort_order: 3,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    badge: "04 / REAL-WORLD WORK",
    title: "Working on Real Projects",
    subtitle: "Focus Collaboration · The BC Cargo & Courier",
    theme: "product",
    paragraphs:
      "I am currently working with Focus on The BC Cargo & Courier's website and its related systems. My work includes website development, billing-related functionality, the admin panel, backend logic, and database-related tasks.\n\nThis experience gives me an opportunity to apply what I learn while working on software that supports real business operations.",
    tech_tags: ["Website Dev", "Billing Logic", "Admin Panel", "Database / Supabase"],
    stat_label_1: "Client / Work",
    stat_val_1: "The BC Cargo",
    stat_label_2: "Role",
    stat_val_2: "Website & Billing Logic",
    sort_order: 4,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    badge: "05 / FUTURE VISION",
    title: "A Marketplace for Software Projects",
    subtitle: "Aspirational Goal · Digital Creator Platform",
    theme: "vision",
    paragraphs:
      "One of my future goals is to build a platform where I can sell my own digital projects and software to vendors.\n\nI want each vendor to have a dedicated URL, access to purchased projects, and a dashboard where they can manage their products and related information. I am still developing this idea and want to turn it into a practical project as my skills grow.",
    tech_tags: ["Multi-Vendor", "Storefront URLs", "Vendor Dashboards", "Digital Marketplace"],
    stat_label_1: "Goal",
    stat_val_1: "Vendor Platform",
    stat_label_2: "Status",
    stat_val_2: "Concept in Development",
    sort_order: 5,
    published: true,
  },
];

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
