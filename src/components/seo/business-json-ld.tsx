import { absoluteUrl } from "@/lib/site-url";
import type { SiteSettings } from "@/lib/types";
import { normalizePhoneNumber } from "@/lib/whatsapp";

/**
 * `FoodEstablishment` structured data — PRD §19.4.
 *
 * Only fields RHF can actually evidence are emitted. Business hours and social
 * profiles are omitted until they are on record (PRD §27), because inventing
 * them would put unverifiable claims into search results.
 */
export function BusinessJsonLd({ settings }: { settings: SiteSettings }) {
  const sameAs = [
    settings.instagramUrl,
    settings.tiktokUrl,
    settings.facebookUrl,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    "@id": absoluteUrl("/#business"),
    name: settings.brandName,
    slogan: settings.tagline,
    description: settings.seoDescription,
    url: absoluteUrl("/"),
    image: absoluteUrl("/logo-rhf.png"),
    logo: absoluteUrl("/logo-rhf.png"),
    telephone: `+${normalizePhoneNumber(settings.whatsappNumber)}`,
    servesCuisine: "Indonesian",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kabupaten Tegal",
      addressRegion: "Jawa Tengah",
      addressCountry: "ID",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: settings.serviceArea,
    },
    ...(settings.businessHours
      ? { openingHours: settings.businessHours }
      : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
