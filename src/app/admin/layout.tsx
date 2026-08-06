import type { Metadata } from "next";

/**
 * Admin chrome.
 *
 * Intentionally bare for now — the sidebar and navigation arrive in stage 3
 * with the dashboard. This exists in stage 2 so `/admin/login` and `/admin`
 * are kept out of the public layout, and so `noindex` covers the whole
 * section in one place.
 */
export const metadata: Metadata = {
  title: "Admin RHF Catering",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-dvh flex-col bg-rhf-cream">{children}</div>;
}
