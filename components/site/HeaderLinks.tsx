"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = readonly [href: string, label: string];

/** Header links with an active indicator: the current page, or on the home page the section in view. */
export function HeaderLinks({ links }: { links: readonly Item[] }) {
  const path = usePathname();
  const home = path === "/";
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    if (!home) return;
    const ids = links.map(([href]) => href.slice(1));
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = ids.find((id) => seen.get(id));
        setSection(current ? `/${current}` : null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [home, links]);

  const active = home ? section : path;
  return (
    <ul>
      {links.map(([href, label]) => (
        <li key={href}>
          <Link href={href} aria-current={active === href ? (home ? "location" : "page") : undefined}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}
