import type { Metadata } from "next";
import { About } from "@/components/site/Sections";
import { Shell } from "@/components/site/Shell";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "About",
  description: "About Ayush Aryal, a self-taught software developer in Hetauda, Nepal building production software for a family courier business.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { settings, aboutChapters } = await getSiteData();
  return (
    <Shell s={settings} title={settings.about_heading || "About me"} icon="🙋" lead={settings.about_lead || settings.about_1}>
      <About s={settings} chapters={aboutChapters} bare />
    </Shell>
  );
}
