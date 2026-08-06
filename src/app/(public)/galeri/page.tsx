import type { Metadata } from "next";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CtaBlock } from "@/components/shared/cta-block";
import { PageHeader } from "@/components/shared/page-header";
import { Section } from "@/components/shared/section";
import { getGalleryItems, getSiteSettings } from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Galeri Pesanan",
  description:
    "Dokumentasi pesanan RHF Catering & Snack Box: snack box, nasi box, prasmanan, coffee break, kegiatan dinas, serta proses dapur dan packing.",
  alternates: { canonical: "/galeri" },
};

/** Gallery — PRD §11.7. */
export default async function GaleriPage() {
  const [settings, items] = await Promise.all([
    getSiteSettings(),
    getGalleryItems(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Galeri"
        title="Galeri Pesanan RHF"
        description="Dokumentasi pesanan snack box, nasi box, prasmanan, dan kegiatan catering yang pernah kami kerjakan di Kabupaten Tegal."
      />

      <Section tone="cream">
        <GalleryGrid items={items} />
      </Section>

      <CtaBlock
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={buildGlobalInquiry(settings)}
        title="Ingin pesanan Anda tampil seperti ini?"
        description="Hubungi admin RHF untuk mendiskusikan kebutuhan konsumsi acara Anda, mulai dari pilihan menu sampai jadwal pengiriman."
      />
    </>
  );
}
