import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-url";

/**
 * Robots directives — PRD §19.4.
 *
 * `/admin` is already disallowed so the round-2 panel is never indexed, even
 * before it exists.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
