import {
  Building2,
  Images,
  MessageSquareQuote,
  Plus,
  Settings,
  Tags,
  UtensilsCrossed,
} from "lucide-react";

import { StatCard } from "@/components/admin/stat-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDashboardStats } from "@/lib/admin/queries";
import { verifySession } from "@/lib/auth/dal";
import { getSiteSettings } from "@/lib/repositories";

/**
 * Admin dashboard — PRD §12.2.
 *
 * `verifySession()` runs here rather than in the layout: a layout does not
 * re-render on navigation and does not decide whether its child segments run,
 * so an auth check placed there would not actually stop anything.
 */
export default async function AdminDashboardPage() {
  const session = await verifySession();
  const [stats, settings] = await Promise.all([
    getDashboardStats(),
    getSiteSettings(),
  ]);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-rhf-border bg-rhf-cream/90 px-4 backdrop-blur">
        <SidebarTrigger />
        <h1 className="font-heading text-base font-bold text-rhf-charcoal">
          Dashboard
        </h1>
      </header>

      <div className="flex-1 p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Halo, <span className="font-semibold text-rhf-charcoal">{session.name}</span> — ini ringkasan konten website.
        </p>

        <section aria-labelledby="ringkasan" className="mt-6">
          <h2 id="ringkasan" className="sr-only">
            Ringkasan konten
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Menu / Paket" count={stats.menuItems} icon={UtensilsCrossed} />
            <StatCard label="Kategori" count={stats.categories} icon={Tags} />
            <StatCard label="Foto Galeri" count={stats.gallery} icon={Images} />
            <StatCard label="Testimoni" count={stats.testimonials} icon={MessageSquareQuote} />
            <StatCard label="Client / Instansi" count={stats.clients} icon={Building2} />
          </div>
        </section>

        <section aria-labelledby="pintasan" className="mt-8">
          <h2
            id="pintasan"
            className="font-heading text-sm font-bold tracking-wide text-rhf-brown uppercase"
          >
            Pintasan
          </h2>

          <div className="mt-3 grid gap-4 lg:grid-cols-2">
            {/*
              Both shortcuts PRD §12.2 asks for lead to pages built in stages
              4 and 5, so they are shown as not-yet-available rather than as
              links to nothing.
            */}
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-rhf-border bg-white/60 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rhf-cream text-rhf-deep-orange">
                <Plus aria-hidden className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-rhf-charcoal">
                  Tambah menu baru
                </p>
                <p className="text-sm text-muted-foreground">
                  Tersedia di tahap berikutnya.
                </p>
              </div>
            </div>

            {/*
              The number itself is shown even though editing lands in stage 5.
              It is the whole order pipeline (PRD §18.4), so seeing which number
              is live is worth something on its own.
            */}
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-rhf-border bg-white/60 p-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rhf-cream text-rhf-deep-orange">
                <Settings aria-hidden className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-rhf-charcoal">
                  Nomor WhatsApp aktif
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  <span className="font-semibold text-rhf-deep-orange tabular-nums">
                    {settings.whatsappNumber}
                  </span>{" "}
                  · ubah di Pengaturan, tahap berikutnya
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
