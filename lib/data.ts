import { publicClient } from "@/lib/supabase/public";
import {
  aboutChapterRow,
  projectRow,
  settingsSchema,
  skillRow,
  testimonialRow,
  type AboutChapter,
  type Project,
  type Settings,
  type Skill,
  type Testimonial,
} from "@/lib/schemas";
import { seedAboutChapters, seedProjects, seedSettings, seedSkills, seedTestimonials } from "@/lib/seed";

export type SiteData = {
  settings: Settings;
  projects: Project[];
  skills: Skill[];
  testimonials: Testimonial[];
  aboutChapters: AboutChapter[];
};

const seed: SiteData = {
  settings: seedSettings,
  projects: seedProjects,
  skills: seedSkills,
  testimonials: seedTestimonials,
  aboutChapters: seedAboutChapters,
};

/** Reads published content with RLS-limited anon access. Uses bundled seed content only when Supabase env vars are absent. */
export async function getSiteData(): Promise<SiteData> {
  const db = publicClient();
  if (!db) return seed;
  try {
    const [settings, projects, skills, testimonials, aboutChapters] = await Promise.all([
      db.from("settings").select("*").eq("id", 1).maybeSingle(),
      db.from("projects").select("*").order("sort_order"),
      db.from("skills").select("*").order("sort_order"),
      db.from("testimonials").select("*").order("sort_order"),
      db.from("about_chapters").select("*").order("sort_order"),
    ]);

    // about_chapters table might not be migrated yet on live remote, gracefully fallback if it doesn't exist
    const chaptersData =
      aboutChapters.data && Array.isArray(aboutChapters.data) && aboutChapters.data.length > 0
        ? aboutChapterRow.array().parse(aboutChapters.data)
        : seedAboutChapters;

    return {
      settings: settings.data ? settingsSchema.parse(settings.data) : seedSettings,
      projects: projectRow.array().parse(projects.data ?? []),
      skills: skillRow.array().parse(skills.data ?? []),
      testimonials: testimonialRow.array().parse(testimonials.data ?? []),
      aboutChapters: chaptersData,
    };
  } catch (error) {
    console.error("[getSiteData] Supabase read failed:", error);
    throw error;
  }
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
