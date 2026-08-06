import type { MetadataRoute } from "next";

import { getMenuItemSlugs } from "@/lib/repositories";
import { absoluteUrl } from "@/lib/site-url";

/** Sitemap — PRD §19.4. Detail pages are generated from published packages. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/menu"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/layanan"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/galeri"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/tentang"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/kontak"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const slugs = await getMenuItemSlugs();
  const menuRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: absoluteUrl(`/menu/${slug}`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...menuRoutes].map((route) => ({
    ...route,
    lastModified: now,
  }));
}
