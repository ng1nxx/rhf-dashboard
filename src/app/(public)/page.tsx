import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { BrandStory } from "@/components/home/brand-story";
import { ClientTrust } from "@/components/home/client-trust";
import { Hero } from "@/components/home/hero";
import { OrderingFlow } from "@/components/home/ordering-flow";
import { QuickTrust } from "@/components/home/quick-trust";
import { WhyRhf } from "@/components/home/why-rhf";
import { MenuCard } from "@/components/menu/menu-card";
import { ServiceCard } from "@/components/menu/service-card";
import { BusinessJsonLd } from "@/components/seo/business-json-ld";
import { CtaBlock } from "@/components/shared/cta-block";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Section, SectionHeading } from "@/components/shared/section";
import { TestimonialCard } from "@/components/shared/testimonial-card";
import { Button } from "@/components/ui/button";
import {
  getCategories,
  getClients,
  getFaqs,
  getFeaturedMenuItems,
  getGalleryItems,
  getSiteSettings,
  getTestimonials,
} from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

/**
 * Home page — the section order is fixed by PRD §10.2 and followed exactly.
 * Header and footer live in the root layout, so this covers sections 2–13.
 */
export default async function HomePage() {
  const [settings, categories, featured, gallery, clients, testimonials, faqs] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getFeaturedMenuItems(6),
      getGalleryItems(),
      getClients(),
      getTestimonials(),
      getFaqs(),
    ]);

  const globalMessage = buildGlobalInquiry(settings);

  return (
    <>
      <BusinessJsonLd settings={settings} />

      <Hero settings={settings} whatsappMessage={globalMessage} />

      <QuickTrust />

      {/* 4. Kategori Layanan */}
      <Section tone="cream" id="layanan">
        <SectionHeading
          eyebrow="Layanan Kami"
          title="Layanan Catering RHF"
          description="Pilih kebutuhan catering sesuai acara Anda, mulai dari box praktis sampai prasmanan untuk acara besar."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id} className="flex">
              <ServiceCard category={category} />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="rhfOutline" size="rhf">
            <Link href="/layanan">
              Lihat semua layanan
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>

      {/* 5. Menu/Paket Unggulan */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Paket Pilihan"
          title="Paket Catering Pilihan"
          description="Beberapa pilihan paket yang paling sering dipesan. Isi dan harga dapat disesuaikan dengan kebutuhan acara serta jumlah pesanan."
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, index) => (
            <li key={item.id} className="flex">
              <MenuCard
                item={item}
                categories={categories}
                whatsappNumber={settings.whatsappNumber}
                priority={index < 3}
              />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="rhf" size="rhf">
            <Link href="/menu">
              Lihat katalog lengkap
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>

      <WhyRhf />

      <BrandStory />

      {/* 8. Galeri Preview */}
      <Section tone="white">
        <SectionHeading
          eyebrow="Galeri"
          title="Galeri Pesanan RHF"
          description="Dokumentasi pesanan snack box, nasi box, prasmanan, dan kegiatan catering yang pernah kami kerjakan."
        />

        <div className="mt-12">
          <GalleryGrid items={gallery.slice(0, 6)} showFilter={false} />
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="rhfOutline" size="rhf">
            <Link href="/galeri">
              Lihat galeri lengkap
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>

      <ClientTrust clients={clients} />

      {/* 10. Testimoni */}
      {testimonials.length > 0 ? (
        <Section tone="cream">
          <SectionHeading
            eyebrow="Testimoni"
            title="Kata Pelanggan RHF"
            description="Tanggapan dari pelanggan yang pernah memesan konsumsi acara bersama kami."
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <li key={testimonial.id} className="flex">
                <TestimonialCard testimonial={testimonial} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <OrderingFlow tone="white" />

      {/* 12. FAQ Preview */}
      {faqs.length > 0 ? (
        <Section tone="cream">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="flex flex-col items-start gap-6">
              <SectionHeading
                align="start"
                eyebrow="FAQ"
                title="Pertanyaan yang Sering Diajukan"
                description="Beberapa hal yang paling sering ditanyakan sebelum memesan. Belum terjawab? Silakan hubungi admin kami."
              />

              <Button asChild variant="rhfOutline" size="rhf">
                <Link href="/kontak#faq">
                  Lihat semua pertanyaan
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="rounded-lg border border-rhf-border bg-white px-6">
              <FaqAccordion faqs={faqs.slice(0, 5)} />
            </div>
          </div>
        </Section>
      ) : null}

      <CtaBlock
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={globalMessage}
      />
    </>
  );
}
