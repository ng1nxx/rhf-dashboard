import type { MenuItem, SiteSettings } from "@/lib/types";

/**
 * WhatsApp deep links — PRD §18.
 *
 * Every WhatsApp CTA on the site goes through this module so the number format
 * and message templates live in exactly one place.
 */

/**
 * Converts an Indonesian phone number to the digits-only international form
 * `wa.me` expects.
 *
 * Accepts what an admin might realistically type — `0895…`, `+62 895…`,
 * `62-895…` — so round 2's settings form does not need its own validation to
 * keep links working.
 */
export function normalizePhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;

  return digits;
}

/** Builds a `wa.me` link with the message URL-encoded. */
export function createWhatsAppUrl(
  phoneNumber: string,
  message: string,
): string {
  const phone = normalizePhoneNumber(phoneNumber);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** The general consultation template — PRD §18.2. */
export function buildGlobalInquiry(settings: SiteSettings): string {
  return settings.whatsappTemplate;
}

/**
 * The per-package template — PRD §18.3, with the package name and price label
 * filled in so the admin receives a message they can act on immediately.
 */
export function buildMenuInquiry(
  item: Pick<MenuItem, "name" | "priceLabel">,
): string {
  return `Halo RHF Catering & Snack Box, saya mau tanya/pesan paket berikut:

Nama Paket: ${item.name}
Harga: ${item.priceLabel}
Jumlah Pesanan:
Tanggal Acara:
Lokasi Acara:
Catatan:`;
}

/**
 * A short opener for category-level enquiries, used by the service cards on
 * `/layanan` where the visitor has picked a need but not yet a package.
 */
export function buildCategoryInquiry(categoryName: string): string {
  return `Halo RHF Catering & Snack Box, saya mau konsultasi untuk ${categoryName}.

Tanggal Acara:
Lokasi Acara:
Perkiraan Jumlah:
Catatan:`;
}

/** Human-readable form of the WhatsApp number, e.g. "0895-4227-34153". */
export function formatPhoneForDisplay(input: string): string {
  const digits = input.replace(/\D/g, "");
  const local = digits.startsWith("62") ? `0${digits.slice(2)}` : digits;
  return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}
