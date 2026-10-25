import type { Metadata } from "next";
import { Connect, Skills } from "@/components/site/Sections";
import { Shell } from "@/components/site/Shell";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Skills",
  description: "Business software, websites, Android apps and backend automation by Ayush Aryal, plus the languages and tools used.",
  alternates: { canonical: "/skills" },
};

export default async function SkillsPage() {
  const { settings, skills } = await getSiteData();
  return (
    <Shell s={settings} title="What I do best" icon="🛠️" lead="Business software people use all day, and the tools I build it with.">
      <Skills skills={skills} bare />
      <Connect s={settings} bare />
    </Shell>
  );
}
