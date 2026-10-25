import { publicClient } from "@/lib/supabase/public";
import {
  projectRow,
  settingsSchema,
  skillRow,
  testimonialRow,
  type Project,
  type Settings,
  type Skill,
  type Testimonial,
} from "@/lib/schemas";
import { seedProjects, seedSettings, seedSkills, seedTestimonials } from "@/lib/seed";

export type SiteData = { settings: Settings; projects: Project[]; skills: Skill[]; testimonials: Testimonial[] };

const seed: SiteData = { settings: seedSettings, projects: seedProjects, skills: seedSkills, testimonials: seedTestimonials };

/** Reads published content with RLS-limited anon access. Uses bundled seed content only when Supabase env vars are absent. */
export async function getSiteData(): Promise<SiteData> {
  const db = publicClient();
  if (!db) return seed;
  try {
    const [settings, projects, skills, testimonials] = await Promise.all([
      db.from("settings").select("*").eq("id", 1).maybeSingle(),
      db.from("projects").select("*").order("sort_order"),
      db.from("skills").select("*").order("sort_order"),
      db.from("testimonials").select("*").order("sort_order"),
    ]);
    const failed = [settings, projects, skills, testimonials].find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);
    return {
      settings: settings.data ? settingsSchema.parse(settings.data) : seedSettings,
      projects: projectRow.array().parse(projects.data ?? []),
      skills: skillRow.array().parse(skills.data ?? []),
      testimonials: testimonialRow.array().parse(testimonials.data ?? []),
    };
  } catch (error) {
    // Configured but failing: surface it. During ISR, Next keeps serving the last good page;
    // during a build the deploy fails instead of shipping stale or empty content.
    console.error("[getSiteData] Supabase read failed:", error);
    throw error;
  }
}

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
