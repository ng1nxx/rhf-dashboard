import { Clock, MapPin, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

import { OrderingFlow } from "@/components/home/ordering-flow";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { WhatsAppButton, WhatsAppIcon } from "@/components/shared/whatsapp-button";
import { getFaqs, getSiteSettings } from "@/lib/repositories";
import { buildGlobalInquiry, formatPhoneForDisplay } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak & FAQ",
  description:
    "Hubungi RHF Catering & Snack Box di Kabupaten Tegal melalui WhatsApp untuk konsultasi menu, harga, dan pemesanan konsumsi acara. Lengkap dengan pertanyaan yang sering diajukan.",
  alternates: { canonical: "/kontak" },
};

/**
 * Contact page — PRD §11.11 and §11.12.
 *
 * The full FAQ accordion lives here under `#faq`. PRD §11.1 puts FAQ in the
 * navbar while PRD §10.1 defines no `/faq` route, so pairing it with contact
 * satisfies both without inventing a route outside the agreed IA.
 */
export default async function KontakPage() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);
  const globalMessage = buildGlobalInquiry(settings);

  return (
    <>
      <PageHeader
        eyebrow="Kontak"
        title="Hubungi RHF Catering"
        description="Konsultasi menu, tanya harga, atau langsung memesan. Semua dilayani melalui WhatsApp, tanpa perlu membuat akun."
      />

      <Section tone="cream">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="flex flex-col gap-6 rounded-xl border border-rhf-border bg-white p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-rhf-cream text-rhf-deep-orange">
                <WhatsAppIcon className="size-6" />
              </span>
              <div>
                <h2 className="font-heading text-xl font-bold text-rhf-charcoal">
                  WhatsApp RHF Catering
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cara tercepat untuk berkonsultasi dan memesan.
                </p>
                <p className="mt-3 font-heading text-2xl font-bold text-rhf-deep-orange">
                  {formatPhoneForDisplay(settings.whatsappNumber)}
                </p>
              </div>
            </div>

            <WhatsAppButton
              phoneNumber={settings.whatsappNumber}
              message={globalMessage}
              size="rhfLg"
              className="w-full"
            >
              Chat via WhatsApp
            </WhatsAppButton>

            <p className="text-sm text-muted-foreground">
              Pesan akan terbuka otomatis dengan format konsultasi, tinggal Anda
              lengkapi nama, tanggal acara, lokasi, jenis pesanan, dan jumlahnya.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3.5 rounded-lg border border-rhf-border bg-white p-6">
              <MapPin
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-rhf-orange"
              />
              <div>
                <h2 className="font-heading text-base font-bold text-rhf-charcoal">
                  Lokasi &amp; Area Layanan
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {settings.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  Melayani pesanan di area {settings.serviceArea}. Untuk lokasi
                  di luar area, silakan konfirmasi lebih dulu.
                </p>
              </div>
            </div>

            {settings.businessHours ? (
              <div className="flex items-start gap-3.5 rounded-lg border border-rhf-border bg-white p-6">
                <Clock
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-rhf-orange"
                />
                <div>
                  <h2 className="font-heading text-base font-bold text-rhf-charcoal">
                    Jam Operasional
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {settings.businessHours}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex items-start gap-3.5 rounded-lg border border-rhf-border bg-white p-6">
              <MessageCircle
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-rhf-orange"
              />
              <div>
                <h2 className="font-heading text-base font-bold text-rhf-charcoal">
                  Sebelum Menghubungi
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agar admin dapat membantu lebih cepat, siapkan perkiraan
                  jumlah pesanan, tanggal acara, dan lokasi pengiriman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <OrderingFlow tone="white" />

      {faqs.length > 0 ? (
        <Section tone="cream" id="faq">
          <SectionHeading
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Diajukan"
            description="Belum menemukan jawabannya? Silakan tanyakan langsung kepada admin RHF melalui WhatsApp."
          />

          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-rhf-border bg-white px-6 lg:px-8">
            <FaqAccordion faqs={faqs} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
