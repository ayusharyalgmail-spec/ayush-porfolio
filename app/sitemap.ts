import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...["work", "skills", "about", "proof", "contact"].map((p) => ({ url: `${siteUrl}/${p}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
