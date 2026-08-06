import { Check, MapPin, PackageCheck, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MenuCard } from "@/components/menu/menu-card";
import { FoodImage } from "@/components/shared/food-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { MenuBadge } from "@/components/shared/trust-badge";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import {
  getCategories,
  getMenuItemBySlug,
  getMenuItemSlugs,
  getRelatedMenuItems,
  getSiteSettings,
} from "@/lib/repositories";
import { descriptionBody } from "@/lib/menu-text";
import { absoluteUrl } from "@/lib/site-url";
import { buildMenuInquiry } from "@/lib/whatsapp";

export async function generateStaticParams() {
  const slugs = await getMenuItemSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/menu/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getMenuItemBySlug(slug);

  if (!item) {
    return { title: "Paket tidak ditemukan" };
  }

  const title = item.seoTitle ?? `${item.name} — Katalog Menu`;
  const description = item.seoDescription ?? item.shortDescription;

  return {
    title,
    description,
    alternates: { canonical: `/menu/${item.slug}` },
    openGraph: {
      title,
      description,
      url: `/menu/${item.slug}`,
      type: "article",
    },
  };
}

/** Package detail — PRD §11.6. */
export default async function MenuDetailPage(props: PageProps<"/menu/[slug]">) {
  const { slug } = await props.params;
  const item = await getMenuItemBySlug(slug);

  // Unpublished packages are filtered out by the repository, so this covers
  // both a bad slug and a package the admin has taken offline.
  if (!item) notFound();

  const [settings, categories, related] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getRelatedMenuItems(item, 3),
  ]);

  const itemCategories = categories.filter((c) =>
    item.categoryIds.includes(c.id),
  );
  const inquiryMessage = buildMenuInquiry(item);

  // Product structured data helps the package surface in local search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.shortDescription,
    category: itemCategories.map((c) => c.name).join(", "),
    brand: { "@type": "Brand", name: settings.brandName },
    url: absoluteUrl(`/menu/${item.slug}`),
    ...(item.price
      ? {
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            areaServed: settings.serviceArea,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Menu", href: "/menu" },
          { label: item.name },
        ]}
        title={item.name}
        description={item.shortDescription}
      />

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-rhf-border bg-white shadow-rhf-md">
              <FoodImage
                src={item.imageUrl}
                alt={`${item.name} dari RHF Catering & Snack Box`}
                category={itemCategories[0]?.name}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            {item.galleryImages && item.galleryImages.length > 0 ? (
              <ul className="grid grid-cols-3 gap-3">
                {item.galleryImages.map((image, index) => (
                  <li
                    key={image}
                    className="relative aspect-square overflow-hidden rounded-md border border-rhf-border bg-white"
                  >
                    <FoodImage
                      src={image}
                      alt={`Dokumentasi ${item.name} ${index + 1}`}
                      category={itemCategories[0]?.name}
                      sizes="200px"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-6">
            {itemCategories.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {itemCategories.map((category) => (
                  <li key={category.id}>
                    <MenuBadge>{category.name}</MenuBadge>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="rounded-lg border border-rhf-border bg-white p-6">
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="mt-1 font-heading text-3xl font-extrabold text-rhf-deep-orange">
                {item.priceLabel}
              </p>

              <dl className="mt-5 flex flex-col gap-3 border-t border-rhf-border pt-5 text-sm">
                {item.minOrder ? (
                  <div className="flex items-start gap-2.5">
                    <PackageCheck
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-rhf-orange"
                    />
                    <div>
                      <dt className="inline font-semibold text-rhf-charcoal">
                        Minimal order:{" "}
                      </dt>
                      <dd className="inline text-muted-foreground">
                        {item.minOrder}
                      </dd>
                    </div>
                  </div>
                ) : null}

                {item.suitableFor ? (
                  <div className="flex items-start gap-2.5">
                    <PartyPopper
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-rhf-orange"
                    />
                    <div>
                      <dt className="inline font-semibold text-rhf-charcoal">
                        Cocok untuk:{" "}
                      </dt>
                      <dd className="inline text-muted-foreground">
                        {item.suitableFor}
                      </dd>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-start gap-2.5">
                  <MapPin
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-rhf-orange"
                  />
                  <div>
                    <dt className="inline font-semibold text-rhf-charcoal">
                      Area layanan:{" "}
                    </dt>
                    <dd className="inline text-muted-foreground">
                      {settings.serviceArea}
                    </dd>
                  </div>
                </div>
              </dl>

              <WhatsAppButton
                phoneNumber={settings.whatsappNumber}
                message={inquiryMessage}
                size="rhfLg"
                className="mt-6 w-full"
              >
                Pesan via WhatsApp
              </WhatsAppButton>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Pesan otomatis berisi nama paket dan harga, tinggal lengkapi
                jumlah dan tanggal acara.
              </p>
            </div>

            {item.packageItems && item.packageItems.length > 0 ? (
              <div className="rounded-lg border border-rhf-border bg-white p-6">
                <h2 className="font-heading text-lg font-bold text-rhf-charcoal">
                  Isi Paket
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {item.packageItems.map((entry) => (
                    <li key={entry} className="flex items-start gap-2.5 text-sm">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-rhf-green"
                      />
                      <span className="text-rhf-charcoal/90">{entry}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-rhf-border pt-4 text-xs text-muted-foreground">
                  Isi paket dapat disesuaikan dengan permintaan. Sampaikan
                  kebutuhan Anda saat konsultasi.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* The remainder, not the whole thing: the opening sentence is already
            the page header above, and printing it twice reads as padding. */}
        {descriptionBody(item.description) ? (
          <div className="mt-12 max-w-[45rem] rounded-lg border border-rhf-border bg-white p-6 lg:p-8">
            <h2 className="font-heading text-xl font-bold text-rhf-charcoal">
              Tentang paket ini
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {descriptionBody(item.description)}
            </p>
          </div>
        ) : null}
      </Section>

      {related.length > 0 ? (
        <Section tone="white">
          <SectionHeading
            eyebrow="Paket Lainnya"
            title="Rekomendasi Paket Lain"
            description="Pilihan lain yang sering dipesan untuk kebutuhan acara serupa."
          />

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedItem) => (
              <li key={relatedItem.id} className="flex">
                <MenuCard
                  item={relatedItem}
                  categories={categories}
                  whatsappNumber={settings.whatsappNumber}
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
