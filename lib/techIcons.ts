/**
 * Emoji icons for the "Languages & tools" section, keyed by the technology name as written in the CMS.
 * Only names that actually exist in the portfolio are rendered, so adding an icon here never adds a skill.
 * Anything not listed falls back to a neutral marker.
 */
const ICONS: Record<string, string> = {
  javascript: "🟨",
  typescript: "🔷",
  "c#": "🟪",
  java: "☕",
  python: "🐍",
  sql: "🗄️",
  "html & css": "🌐",
  html: "🌐",
  css: "🎨",
  react: "⚛️",
  "next.js": "▲",
  winui: "🪟",
  supabase: "⚡",
  playwright: "🎭",
  "arduino c++": "🔌",
  android: "📱",
  "node.js": "🟢",
  mysql: "🗄️",
  postgresql: "🐘",
  github: "🐙",
  docker: "🐳",
  "rest api": "🔗",
};

export const techIcon = (name: string): string => ICONS[name.trim().toLowerCase()] ?? "🔹";
