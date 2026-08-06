import { NotFoundContent } from "@/components/shared/not-found-content";

/**
 * The 404 for the whole app.
 *
 * Deliberately renders no header or footer of its own. Next.js routes every
 * `notFound()` here, but still wraps it in the layout of the segment it was
 * thrown from — so a miss inside `(public)` already arrives with the public
 * chrome from `(public)/layout.tsx`. Adding chrome here too renders the navbar
 * and footer twice, which is exactly what happened when it was tried.
 *
 * A URL matching no route group at all gets this content bare. That is fine:
 * the links to the homepage and catalogue are part of `NotFoundContent`, so the
 * page is still a way out rather than a dead end.
 */
export default function NotFound() {
  return <NotFoundContent />;
}
