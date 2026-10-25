import { Fx } from "@/components/fx/Fx";
import { BottomNav } from "@/components/site/BottomNav";
import { Projects } from "@/components/site/Projects";
import { About, Connect, Footer, Header, Hero, Marquee, Proof, Skills } from "@/components/site/Sections";
import { getSiteData, siteUrl } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const { settings, projects, skills, testimonials, aboutChapters } = await getSiteData();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ayush Aryal",
    jobTitle: "Software developer",
    url: siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Hetauda", addressCountry: "NP" },
    sameAs: [settings.github_url, settings.instagram_url].filter(Boolean),
  };

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <div className="pbar" aria-hidden="true" />
      <Header />
      <main id="top">
        <div id="content" />
        <Hero s={settings} />
        <Marquee />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <About s={settings} chapters={aboutChapters} />
        <Proof projects={projects} testimonials={testimonials} />
        <Connect s={settings} />
      </main>
      <Footer s={settings} />
      <BottomNav />
      <Fx />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
