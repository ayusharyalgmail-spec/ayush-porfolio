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
  const { settings } = await getSiteData();
  return (
    <Shell s={settings} title="About me" icon="🙋" lead="I learn by building things people use, then fixing what breaks.">
      <About s={settings} bare />
    </Shell>
  );
}
