"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked; the theme still applies for this visit.
    }
  }
  return (
    <button type="button" className="btn theme" onClick={toggle} aria-label="Switch light or dark theme">
      <span aria-hidden="true">◐</span>
    </button>
  );
}
