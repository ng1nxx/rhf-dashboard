import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { LogoLockup } from "@/components/brand/logo";

/**
 * Admin login — PRD §12.1.
 *
 * `robots.ts` already disallows /admin, but `noindex` is repeated here because
 * robots.txt asks a crawler not to fetch a page, while this tells one that did
 * fetch it not to list it.
 */
export const metadata: Metadata = {
  title: "Masuk — Admin RHF Catering",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-rhf-cream px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoLockup />
        </div>

        <div className="rounded-xl border border-rhf-border bg-white p-6 shadow-rhf-md sm:p-7">
          <h1 className="font-heading text-xl font-bold text-rhf-charcoal">
            Masuk ke Admin
          </h1>
          <p className="mt-1 mb-6 text-sm text-muted-foreground">
            Kelola menu, harga, galeri, dan konten website.
          </p>

          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
