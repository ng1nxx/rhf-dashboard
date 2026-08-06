import { WhatsAppIcon } from "@/components/shared/whatsapp-button";
import { createWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Persistent WhatsApp CTA — PRD §15.3 "Floating WhatsApp button".
 *
 * Sits above the sticky header's stacking context but below the mobile
 * navigation sheet, so it never overlaps an open menu. On small screens it is
 * offset from the bottom edge to clear browser chrome.
 */
export function FloatingWhatsApp({
  phoneNumber,
  message,
}: {
  phoneNumber: string;
  message: string;
}) {
  return (
    <a
      href={createWhatsAppUrl(phoneNumber, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi RHF Catering via WhatsApp"
      className="fixed right-4 bottom-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-rhf-orange px-4 py-3.5 font-semibold text-white shadow-rhf-md transition-all hover:-translate-y-0.5 hover:bg-rhf-deep-orange focus-visible:ring-3 focus-visible:ring-rhf-orange/40 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="hidden text-sm sm:inline">Chat WhatsApp</span>
    </a>
  );
}
