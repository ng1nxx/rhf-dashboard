import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Button } from "@/components/ui/button";

/**
 * Full-bleed orange CTA — DesignRHF §23.
 *
 * This is the only place orange is used as a section background. The 60/30/10
 * ratio in DesignRHF §4 holds because each page renders at most one of these.
 */
export function CtaBlock({
  whatsappNumber,
  whatsappMessage,
  title = "Butuh Catering untuk Acara Anda?",
  description = "RHF Catering & Snack Box siap membantu kebutuhan snack box, nasi box, prasmanan, dan konsumsi acara dengan rasa yang tetap jadi utama.",
  secondaryHref = "/menu",
  secondaryLabel = "Lihat Katalog Menu",
}: {
  whatsappNumber: string;
  whatsappMessage: string;
  title?: string;
  description?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="container-rhf">
        <div className="rounded-xl bg-rhf-orange px-6 py-12 text-center text-white sm:px-10 lg:px-16 lg:py-16">
          <h2 className="mx-auto max-w-2xl font-heading text-[1.75rem] font-bold text-balance sm:text-[2rem] lg:text-[2.5rem]">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-white/90">
            {description}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              message={whatsappMessage}
              variant="rhfOnOrange"
              size="rhfLg"
              className="w-full sm:w-auto"
            >
              Chat via WhatsApp
            </WhatsAppButton>

            <Button
              asChild
              variant="ghost"
              size="rhfLg"
              className="w-full rounded-full border border-white/45 font-semibold text-white hover:bg-white/12 hover:text-white sm:w-auto"
            >
              <Link href={secondaryHref}>
                {secondaryLabel}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
