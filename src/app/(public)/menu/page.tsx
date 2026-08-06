import type { Metadata } from "next";

import { MenuCatalog } from "@/components/menu/menu-catalog";
import { CtaBlock } from "@/components/shared/cta-block";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { parseFilters } from "@/lib/catalog";
import { getCategories, getMenuItems, getSiteSettings } from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Katalog Menu & Paket Catering",
  description:
    "Katalog lengkap paket catering RHF di Kabupaten Tegal: snack box, nasi box, prasmanan, coffee break, paket rapat/dinas, sekolah, pengajian, pernikahan, dan aqiqah.",
  alternates: { canonical: "/menu" },
};

/**
 * Catalogue page — PRD §11.5.
 *
 * Filters are read from the query string on the server so a shared or
 * deep-linked URL renders already filtered; `MenuCatalog` then takes over the
 * interaction on the client using the same pure filter function.
 */
export default async function MenuPage(props: PageProps<"/menu">) {
  const searchParams = await props.searchParams;
  const [settings, categories, items] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getMenuItems(),
  ]);

  const asString = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  // The URL carries a category slug so links stay readable; the catalogue
  // filters on id, so it is resolved here.
  const requestedSlug = asString(searchParams.kategori);
  const matchedCategory = categories.find((c) => c.slug === requestedSlug);

  const filters = parseFilters({
    kategori: matchedCategory?.id ?? asString(searchParams.kategori),
    cari: asString(searchParams.cari),
    urutkan: asString(searchParams.urutkan),
  });

  return (
    <>
      <PageHeader
        eyebrow="Katalog Menu"
        title="Paket Catering RHF"
        description="Semua paket yang tersedia beserta isi dan kisaran harganya. Isi paket dapat disesuaikan dengan kebutuhan acara Anda."
      />

      <Section tone="cream">
        <MenuCatalog
          items={items}
          categories={categories}
          whatsappNumber={settings.whatsappNumber}
          initialFilters={filters}
        />

        <p className="mt-10 rounded-lg border border-rhf-border bg-white p-5 text-sm text-muted-foreground">
          Harga yang tercantum adalah harga mulai dari dan dapat berubah
          mengikuti isi paket serta jumlah pesanan. Untuk paket bertanda Hubungi
          Admin, harga disusun sesuai kebutuhan acara. Silakan konsultasikan
          anggaran Anda melalui WhatsApp.
        </p>
      </Section>

      <CtaBlock
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={buildGlobalInquiry(settings)}
        title="Belum menemukan paket yang cocok?"
        description="Sampaikan kebutuhan acara dan anggaran Anda. Admin RHF akan membantu menyusun paket yang paling sesuai."
        secondaryHref="/layanan"
        secondaryLabel="Lihat Layanan"
      />
    </>
  );
}
