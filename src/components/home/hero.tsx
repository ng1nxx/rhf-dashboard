import { ArrowRight, MapPin, Sparkles, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { FoodImage } from "@/components/shared/food-placeholder";
import { TrustBadge } from "@/components/shared/trust-badge";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

/**
 * Hero — PRD §11.2, using the final copy from PRD §13.1.
 *
 * The H1 leads with brand plus location because that is what the local SEO
 * targets in PRD §19.1 are built around; DesignRHF §15's warmer line runs above
 * it as the eyebrow so the brand tone survives.
 */
export function Hero({
  settings,
  whatsappMessage,
}: {
  settings: SiteSettings;
  whatsappMessage: string;
}) {
  return (
    <section className="relative overflow-hidden bg-rhf-cream">
      {/* Soft warm wash behind the visual; kept subtle per DesignRHF §2. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 hidden size-[34rem] rounded-full bg-rhf-gold/15 blur-3xl lg:block"
      />

      <div className="container-rhf relative grid items-center gap-12 py-14 md:py-18 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-rhf-border bg-white px-4 py-2 text-xs font-semibold tracking-[0.1em] text-rhf-brown uppercase">
            <Sparkles aria-hidden className="size-3.5 text-rhf-orange" />
            Snack Box • Nasi Box • Prasmanan • Coffee Break
          </span>

          <h1 className="font-heading text-[2.25rem] leading-[1.1] font-extrabold text-rhf-charcoal sm:text-[2.75rem] lg:text-[3.25rem]">
            RHF Catering &amp; Snack Box{" "}
            <span className="text-rhf-deep-orange">Kabupaten Tegal</span>
          </h1>

          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground lg:text-lg">
            Pilihan snack box, nasi box, coffee break, dan prasmanan untuk acara
            keluarga, sekolah, kantor, hingga dinas. Mengutamakan rasa,
            kerapian, dan pelayanan yang amanah.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <WhatsAppButton
              phoneNumber={settings.whatsappNumber}
              message={whatsappMessage}
              size="rhfLg"
              className="w-full sm:w-auto"
            >
              Pesan via WhatsApp
            </WhatsAppButton>

            <Button
              asChild
              variant="rhfOutline"
              size="rhfLg"
              className="w-full sm:w-auto"
            >
              <Link href="/menu">
                Lihat Katalog Menu
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-2.5 pt-2">
            <li>
              <TrustBadge icon={UtensilsCrossed}>Mengutamakan Rasa</TrustBadge>
            </li>
            <li>
              <TrustBadge icon={MapPin}>
                Melayani {settings.serviceArea}
              </TrustBadge>
            </li>
          </ul>
        </div>

        {/* pb reserves room for the brand marker that sits below the card. */}
        <div className="relative pb-20">
          <div className="relative overflow-hidden rounded-xl border border-rhf-border bg-white shadow-rhf-lg">
            {/* 16:9 matches the banner's own ratio, so nothing is cropped. */}
            <div className="relative aspect-video">
              <FoodImage
                src="/Beranda1.png"
                alt="Empat layanan RHF Catering berjajar: snack box berisi kue basah dan air mineral, prasmanan dengan lauk hangat di atas chafing dish, nasi box lengkap dengan ayam goreng dan sayur, serta paket sekolah dengan susu dan buah."
                category="Nasi Box"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
          </div>

          {/* Brand marker — DesignRHF §6 allows the logo as a hero badge. Anchored
              to the card's bottom edge rather than overlapping it: the banner is
              busy edge to edge, so any overlap would hide part of the photo. */}
          <div className="absolute top-full left-4 mt-3 flex items-center gap-3 rounded-lg border border-rhf-border bg-white px-4 py-3 shadow-rhf-md sm:left-6">
            <LogoMark size={40} />
            <div className="leading-tight">
              <p className="font-heading text-sm font-bold text-rhf-charcoal">
                {settings.tagline}
              </p>
              <p className="text-xs text-muted-foreground">
                Dirintis dari usaha keluarga
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
