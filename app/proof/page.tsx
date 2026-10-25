import type { Metadata } from "next";
import { Proof } from "@/components/site/Sections";
import { Shell } from "@/components/site/Shell";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Proof",
  description: "Where Ayush Aryal's software runs in production, with project counts and client feedback.",
  alternates: { canonical: "/proof" },
};

export default async function ProofPage() {
  const { settings, projects, testimonials } = await getSiteData();
  return (
    <Shell s={settings} title="Proof it works" icon="✅" lead="Real software, running in a real business every day.">
      <Proof projects={projects} testimonials={testimonials} bare />
    </Shell>
  );
}
