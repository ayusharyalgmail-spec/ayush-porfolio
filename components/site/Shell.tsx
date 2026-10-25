import { Fx } from "@/components/fx/Fx";
import { BottomNav } from "@/components/site/BottomNav";
import { Footer, Header } from "@/components/site/Sections";
import type { Settings } from "@/lib/schemas";

type Props = { s: Settings; title: string; icon?: string; lead?: string; children: React.ReactNode };

/** Chrome shared by the standalone pages. With `icon`, a visible page header replaces the sections' own titles. */
export function Shell({ s, title, icon, lead, children }: Props) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <div className="pbar" aria-hidden="true" />
      <Header />
      <main id="content" style={icon ? undefined : { paddingTop: 48 }}>
        <div id="top" />
        {icon ? (
          <div className="wrap page-head">
            <span className="ico big" aria-hidden="true">{icon}</span>
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
          </div>
        ) : (
          <h1 className="sr-only">{title}</h1>
        )}
        {children}
      </main>
      <Footer s={s} />
      <BottomNav />
      <Fx />
    </>
  );
}
