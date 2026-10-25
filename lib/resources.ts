import { aboutChapterSchema, CHAPTER_THEMES, COLORS, projectSchema, skillSchema, testimonialSchema } from "@/lib/schemas";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select";
  options?: readonly string[];
  hint?: string;
  required?: boolean;
  group?: string;
};

export const resources = {
  projects: {
    label: "Projects",
    singular: "project",
    titleKey: "name",
    schema: projectSchema,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true, hint: "lowercase-with-dashes" },
      { name: "tagline", label: "Tagline", type: "text", required: true },
      { name: "role", label: "Your role", type: "text", hint: "e.g. Sole developer" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "features", label: "Key features", type: "textarea", hint: "One per line, up to 8. Only real features." },
      { name: "tags", label: "Tags", type: "text", hint: "Comma separated" },
      { name: "color", label: "Accent colour", type: "select", options: COLORS },
      { name: "image_url", label: "Image URL", type: "text", hint: "https:// (optional)" },
      { name: "live_url", label: "Live site URL", type: "text", hint: "https:// (optional)" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ] satisfies Field[],
  },
  skills: {
    label: "Skills",
    singular: "skill",
    titleKey: "title",
    schema: skillSchema,
    fields: [
      { name: "kind", label: "Type", type: "select", options: ["service", "tools"], hint: "service = card, tools = tag group" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description (service)", type: "textarea" },
      { name: "best_for", label: "Best for (service)", type: "text" },
      { name: "project_slug", label: "Example project slug (service)", type: "text" },
      { name: "items", label: "Items (tools)", type: "text", hint: "Comma separated" },
      { name: "color", label: "Accent colour", type: "select", options: COLORS },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ] satisfies Field[],
  },
  testimonials: {
    label: "Testimonials",
    singular: "testimonial",
    titleKey: "name",
    schema: testimonialSchema,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "avatar_url", label: "Avatar URL", type: "text", hint: "https:// (optional)" },
      { name: "sort_order", label: "Order", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ] satisfies Field[],
  },
  about_chapters: {
    label: "About Chapters",
    singular: "chapter",
    titleKey: "title",
    schema: aboutChapterSchema,
    fields: [
      { name: "badge", label: "Eyebrow / Badge", type: "text", required: true, hint: "e.g. 01 / THE BEGINNING" },
      { name: "title", label: "Heading", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text", hint: "e.g. Grade 12 · NRVM Simara" },
      { name: "theme", label: "Visual theme", type: "select", options: CHAPTER_THEMES, hint: "cosmic (space), code (terminal), experiment (memory), product (preview), vision (marketplace)" },
      { name: "paragraphs", label: "Story paragraphs", type: "textarea", required: true, hint: "Separate paragraphs with a blank line" },
      { name: "tech_tags", label: "Topics & tech tags", type: "text", hint: "Comma separated" },
      { name: "stat_label_1", label: "Metric / Chip 1 label", type: "text" },
      { name: "stat_val_1", label: "Metric / Chip 1 value", type: "text" },
      { name: "stat_label_2", label: "Metric / Chip 2 label", type: "text" },
      { name: "stat_val_2", label: "Metric / Chip 2 value", type: "text" },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "published", label: "Published", type: "checkbox" },
    ] satisfies Field[],
  },
} as const;

export const settingsFields: Field[] = [
  { group: "Hero", name: "hero_line_1", label: "Hero line 1", type: "text", required: true },
  { group: "Hero", name: "hero_line_2", label: "Hero line 2", type: "text", required: true },
  { group: "Hero", name: "hero_intro", label: "Hero intro", type: "textarea", required: true },
  { group: "Hero", name: "open_to_work", label: "Show “Open to new projects”", type: "checkbox" },
  { group: "Contact and links", name: "location", label: "Location", type: "text", required: true },
  { group: "Contact and links", name: "role_line", label: "Role line", type: "text", required: true },
  { group: "Contact and links", name: "email", label: "Public email", type: "text", hint: "Leave empty to hide the Email button" },
  { group: "Contact and links", name: "email_2", label: "Second email", type: "text", hint: "Leave empty to hide" },
  { group: "Contact and links", name: "phone", label: "Phone number", type: "text", hint: "Digits, e.g. 9823716862" },
  { group: "Contact and links", name: "whatsapp", label: "WhatsApp number", type: "text", hint: "Digits, e.g. 9823716862" },
  { group: "Contact and links", name: "github_url", label: "GitHub URL", type: "text", hint: "https:// (optional)" },
  { group: "Contact and links", name: "instagram_url", label: "Instagram URL", type: "text", hint: "https:// (optional)" },
  { group: "About Me Section", name: "about_heading", label: "Section heading", type: "text", hint: "Main big title" },
  { group: "About Me Section", name: "about_lead", label: "Section subtitle / lead", type: "textarea", hint: "Introductory lead text" },
  { group: "About Me Section", name: "age", label: "Age badge", type: "text", hint: "e.g. 18" },
  { group: "About Me Section", name: "about_1", label: "Short bio paragraph 1", type: "textarea", required: true },
  { group: "About Me Section", name: "about_2", label: "Short bio paragraph 2", type: "textarea" },
  { group: "About Me Section", name: "photo_url", label: "Photo URL", type: "text", hint: "https://… or /file.webp in /public (optional)" },
];

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string[] | undefined> };

export type ResourceKey = keyof typeof resources;
export const isResourceKey = (k: string): k is ResourceKey => k in resources;
