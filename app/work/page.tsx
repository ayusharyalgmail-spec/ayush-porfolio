import type { Metadata } from "next";
import { Projects } from "@/components/site/Projects";
import { Shell } from "@/components/site/Shell";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Work",
  description: "Projects by Ayush Aryal: The BC Cargo courier platform, DateWithStranger, LM Arena API and Arduino Bluetooth control.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const { settings, projects } = await getSiteData();
  return (
    <Shell s={settings} title="Work">
      <Projects projects={projects} priorityFirst />
    </Shell>
  );
}
