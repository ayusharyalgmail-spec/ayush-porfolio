"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/site/ThemeToggle";

const ICONS: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
  projects: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3" /></>,
  skills: <path d="M4 7l5 5-5 5M12 18h8" />,
  testimonials: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />,
  messages: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2l.4 2.6h4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" /></>,
};

const LINKS = [
  ["/admin", "Dashboard", "dashboard"],
  ["/admin/projects", "Projects", "projects"],
  ["/admin/skills", "Skills", "skills"],
  ["/admin/testimonials", "Testimonials", "testimonials"],
  ["/admin/messages", "Messages", "messages"],
  ["/admin/settings", "Settings", "settings"],
] as const;

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export function AdminNav({ unread, signOutAction }: { unread: number; signOutAction: () => Promise<void> }) {
  const path = usePathname();
  return (
    <aside className="ad-side">
      <Link className="ad-brand" href="/admin">
        <span className="ad-mark" aria-hidden="true">AA</span>
        <span>Portfolio admin</span>
      </Link>
      <nav aria-label="Admin">
        <ul>
          {LINKS.map(([href, label, icon]) => (
            <li key={href}>
              <Link href={href} aria-current={(href === "/admin" ? path === href : path.startsWith(href)) ? "page" : undefined}>
                <Icon name={icon} />
                <span>{label}</span>
                {icon === "messages" && unread > 0 && <b className="ad-count" aria-label={`${unread} unread`}>{unread}</b>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ad-side-foot">
        <a className="ad-link" href="/" target="_blank" rel="noopener noreferrer">View site<span className="sr-only"> (opens in a new tab)</span></a>
        <div className="ad-foot-row">
          <ThemeToggle />
          <form action={signOutAction}><button type="submit" className="ad-btn">Sign out</button></form>
        </div>
      </div>
    </aside>
  );
}
