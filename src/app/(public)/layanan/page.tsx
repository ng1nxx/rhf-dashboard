import type { Metadata } from "next";

import { ServiceCard } from "@/components/menu/service-card";
import { CtaBlock } from "@/components/shared/cta-block";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import {
  getEventCategories,
  getProductCategories,
  getSiteSettings,
} from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Layanan Catering",
  description:
    "Layanan RHF Catering & Snack Box di Kabupaten Tegal: snack box, nasi box, prasmanan, coffee break, serta paket untuk rapat/dinas, sekolah, pengajian, pernikahan, dan aqiqah.",
  alternates: { canonical: "/layanan" },
};

/**
 * Services page — PRD §11.4.
 *
 * Split into the two groupings from PRD §8.1 so a visitor can arrive either
 * knowing the product they want or only the event they are running. The same
 * package legitimately appears under both, which PRD §8.2 explicitly allows.
 */
export default async function LayananPage() {
  const [settings, productCategories, eventCategories] = await Promise.all([
    getSiteSettings(),
    getProductCategories(),
    getEventCategories(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Layanan"
        title="Layanan Catering RHF"
        description="RHF Catering & Snack Box melayani kebutuhan konsumsi acara di Kabupaten Tegal, mulai dari box praktis untuk rapat sampai prasmanan untuk acara besar."
      />

      <Section tone="cream">
        <SectionHeading
          align="start"
          eyebrow="Berdasarkan Produk"
          title="Pilih Berdasarkan Jenis Sajian"
          description="Sudah tahu bentuk sajian yang Anda butuhkan? Mulai dari sini."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((category) => (
            <li key={category.id} className="flex">
              <ServiceCard category={category} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white">
        <SectionHeading
          align="start"
          eyebrow="Berdasarkan Acara"
          title="Pilih Berdasarkan Kebutuhan Acara"
          description="Belum yakin bentuk sajiannya? Pilih jenis acara Anda, dan kami bantu menyusun menunya."
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map((category) => (
            <li key={category.id} className="flex">
              <ServiceCard category={category} />
            </li>
          ))}
        </ul>

        <p className="mt-10 rounded-lg border border-rhf-border bg-rhf-cream p-5 text-sm text-muted-foreground">
          Satu paket dapat masuk ke beberapa kategori sekaligus. Misalnya, satu
          paket nasi box bisa digunakan untuk kebutuhan rapat dinas maupun acara
          sekolah, dengan penyesuaian isi dan porsi.
        </p>
      </Section>

      <CtaBlock
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={buildGlobalInquiry(settings)}
        title="Butuh bantuan memilih layanan?"
        description="Sampaikan jenis acara, jumlah tamu, dan perkiraan anggaran Anda. Admin RHF akan membantu menyusun pilihan yang paling sesuai."
      />
    </>
  );
}
