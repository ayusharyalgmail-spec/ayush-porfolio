import { z } from "zod";

export const COLORS = ["blue", "pink", "teal", "orange", "gold"] as const;
export type Color = (typeof COLORS)[number];

const optUrl = z.preprocess(
  (v) => v ?? "",
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || (v.startsWith("https://") && URL.canParse(v)), "Must be an https:// URL")
    .transform((v) => (v === "" ? null : v)),
);
const optImage = z.preprocess(
  (v) => v ?? "",
  z.string().trim().max(500).refine((v) => v === "" || v.startsWith("/") || (v.startsWith("https://") && URL.canParse(v)), "Use an https:// URL or a /path").transform((v) => (v === "" ? null : v)),
);
const optPhone = z.preprocess((v) => v ?? "", z.string().trim().max(20).refine((v) => v === "" || /^[0-9+ ()-]{7,20}$/.test(v), "Digits only, e.g. 9823716862").transform((v) => (v === "" ? null : v)));
const optText = (max: number) =>
  z.preprocess((v) => v ?? "", z.string().trim().max(max).transform((v) => (v === "" ? null : v)));
const list = (maxItems: number) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v),
    z.array(z.string().min(1).max(40)).max(maxItems),
  );
const lines = (maxItems: number) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : v),
    z.array(z.string().min(1).max(100)).max(maxItems),
  );
const bool = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
const order = z.preprocess((v) => (v === "" || v == null ? 0 : v), z.coerce.number().int().min(0).max(9999));
const color = z.enum(COLORS);
const id = z.uuid();

export const projectSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]{2,60}$/, "Lowercase letters, numbers and dashes only"),
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(200),
  role: optText(200),
  features: lines(8),
  description: z.string().trim().min(1).max(2000),
  tags: list(12),
  color,
  image_url: optImage,
  live_url: optUrl,
  sort_order: order,
  published: bool,
});
export const projectRow = projectSchema.extend({ id });

export const skillSchema = z.object({
  kind: z.enum(["service", "tools"]),
  title: z.string().trim().min(1).max(80),
  description: optText(300),
  best_for: optText(120),
  project_slug: optText(60),
  items: list(20),
  color,
  sort_order: order,
  published: bool,
});
export const skillRow = skillSchema.extend({ id });

export const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(80),
  role: optText(120),
  quote: z.string().trim().min(1).max(600),
  avatar_url: optUrl,
  sort_order: order,
  published: bool,
});
export const testimonialRow = testimonialSchema.extend({ id });

export const settingsSchema = z.object({
  location: z.string().trim().min(1).max(80),
  role_line: z.string().trim().min(1).max(120),
  hero_line_1: z.string().trim().min(1).max(60),
  hero_line_2: z.string().trim().min(1).max(60),
  hero_intro: z.string().trim().min(1).max(400),
  open_to_work: bool,
  email: optText(120),
  email_2: optText(120),
  phone: optPhone,
  whatsapp: optPhone,
  github_url: optUrl,
  instagram_url: optUrl,
  about_1: z.string().trim().min(1).max(1000),
  about_2: optText(1000),
  photo_url: optImage,
});

export const messageRow = z.object({
  id,
  name: z.string(),
  email: z.string(),
  subject: z.string().nullable(),
  body: z.string(),
  read: z.boolean(),
  created_at: z.string(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(80),
  email: z.email("Enter a valid email").max(120),
  subject: z.string().trim().max(120).optional(),
  body: z.string().trim().min(10, "Write at least 10 characters").max(2000),
  website: z.string().max(200).optional(), // honeypot: real users leave it empty
});

export const loginSchema = z.object({ email: z.email().max(120), password: z.string().min(8).max(200) });

export type Project = z.infer<typeof projectRow>;
export type Skill = z.infer<typeof skillRow>;
export type Testimonial = z.infer<typeof testimonialRow>;
export type Settings = z.infer<typeof settingsSchema>;
export type Message = z.infer<typeof messageRow>;
