import { Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { LogoLockup } from "@/components/brand/logo";
import { WhatsAppIcon } from "@/components/shared/whatsapp-button";
import { NAV_ITEMS } from "@/lib/navigation";
import type { SiteSettings } from "@/lib/types";
import { createWhatsAppUrl, formatPhoneForDisplay } from "@/lib/whatsapp";

/** Social links are only rendered for platforms that have a URL on record. */
function socialLinks(settings: SiteSettings) {
  return [
    { label: "Instagram", url: settings.instagramUrl },
    { label: "TikTok", url: settings.tiktokUrl },
    { label: "Facebook", url: settings.facebookUrl },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));
}

/** Site footer — PRD §11.12, styled per DesignRHF §24. */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = socialLinks(settings);

  return (
    <footer className="bg-rhf-charcoal text-rhf-cream">
      <div className="container-rhf py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <LogoLockup size={56} tone="dark" />
            <p className="max-w-md text-sm leading-relaxed text-rhf-cream/75">
              {settings.brandName} melayani snack box, nasi box, coffee break,
              dan prasmanan untuk kebutuhan konsumsi acara dengan mengutamakan
              rasa, kerapian, dan pelayanan yang amanah.
            </p>
            {socials.length > 0 ? (
              <ul className="flex flex-wrap gap-3 pt-1">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-rhf-cream/25 px-3.5 py-1.5 text-xs font-medium text-rhf-gold transition-colors hover:border-rhf-gold hover:text-rhf-gold"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Navigasi footer">
            <h2 className="font-heading text-sm font-semibold tracking-[0.14em] text-rhf-cream uppercase">
              Navigasi
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-rhf-cream/75 transition-colors hover:text-rhf-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold tracking-[0.14em] text-rhf-cream uppercase">
              Kontak
            </h2>
            <ul className="mt-4 flex flex-col gap-3.5 text-sm">
              <li>
                <a
                  href={createWhatsAppUrl(
                    settings.whatsappNumber,
                    settings.whatsappTemplate,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-medium text-rhf-gold transition-opacity hover:opacity-85"
                >
                  <WhatsAppIcon className="size-4 shrink-0" />
                  {formatPhoneForDisplay(settings.whatsappNumber)}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-rhf-cream/75">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
                <span>
                  {settings.location}
                  <br />
                  Area layanan: {settings.serviceArea}
                </span>
              </li>
              {settings.businessHours ? (
                <li className="flex items-start gap-2.5 text-rhf-cream/75">
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <span>{settings.businessHours}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-rhf-cream/15 pt-6 text-xs text-rhf-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {settings.brandName}. Seluruh hak
            cipta dilindungi.
          </p>
          <p>{settings.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
