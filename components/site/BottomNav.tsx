"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ITEMS = [
  { id: "top", href: "/", label: "Home", icon: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></> },
  { id: "work", href: "/work", label: "Work", icon: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V4h6v3" /></> },
  { id: "skills", href: "/skills", label: "Skills", icon: <path d="M4 7l5 5-5 5M12 18h8" /> },
  { id: "about", href: "/about", label: "About", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></> },
  { id: "contact", href: "/contact", label: "Contact", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></> },
];

/** On the home page it tracks the section in view; on standalone pages it marks the current route. */
export function BottomNav() {
  const path = usePathname();
  const home = path === "/";
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!home) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let k = 0;
      ITEMS.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.45) k = i;
      });
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) k = ITEMS.length - 1;
      setActive(k);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [home]);

  return (
    <nav className="bnav" aria-label="Quick">
      <ul>
        {ITEMS.map((it, i) => {
          const current = home ? i === active : it.href === path;
          const icon = <svg viewBox="0 0 24 24" aria-hidden="true">{it.icon}</svg>;
          return (
            <li key={it.id}>
              {home && it.id !== "skills" ? (
                <a href={`#${it.id}`} aria-current={current ? "true" : undefined}>{icon}{it.label}</a>
              ) : (
                <Link href={it.href} aria-current={current ? (home ? "true" : "page") : undefined}>{icon}{it.label}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
