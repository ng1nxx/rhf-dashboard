/**
 * Canonical origin for metadata, sitemap, and JSON-LD.
 *
 * Prefers an explicit `NEXT_PUBLIC_SITE_URL`, then the URL Vercel injects for
 * the current deployment, and falls back to localhost so `next build` succeeds
 * before a domain exists.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Joins a path onto the canonical origin. */
export function absoluteUrl(path: string): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
