import type { Metadata } from "next";
import { Connect } from "@/components/site/Sections";
import { Shell } from "@/components/site/Shell";
import { getSiteData } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ayush Aryal by form, WhatsApp, phone or email to discuss a website, Android app or business software project.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { settings } = await getSiteData();
  return (
    <Shell s={settings} title="Get in touch" icon="💬" lead="Tell me the problem. I will say honestly if I can solve it and how long it takes.">
      <Connect s={settings} bare />
    </Shell>
  );
}
