import type { SiteSettings } from "@/lib/types";

/**
 * Site-wide settings — PRD §12.9.
 *
 * This is the single source for contact details. Nothing else in the codebase
 * hardcodes a phone number, so making these editable in round 2 updates every
 * CTA on the site at once (PRD §18.4).
 *
 * Fields left undefined are the ones PRD §27 lists as still outstanding; the UI
 * omits their sections rather than showing empty labels.
 */
export const SITE_SETTINGS: SiteSettings = {
  brandName: "RHF Catering & Snack Box",
  tagline: "Mengutamakan Rasa",
  whatsappNumber: "0895422734153",
  whatsappTemplate: `Halo RHF Catering & Snack Box, saya mau konsultasi pesanan untuk acara.

Nama:
Tanggal Acara:
Lokasi Acara:
Jenis Pesanan: Snack Box / Nasi Box / Prasmanan / Coffee Break / Lainnya
Jumlah Pesanan:
Catatan:`,
  location: "Kabupaten Tegal, Jawa Tengah",
  serviceArea: "Kabupaten Tegal",
  // businessHours, social links, and email are pending — PRD §27 items 4 and 5.
  seoTitle:
    "RHF Catering & Snack Box Kabupaten Tegal | Snack Box, Nasi Box & Prasmanan",
  seoDescription:
    "RHF Catering & Snack Box melayani snack box, nasi box, coffee break, dan prasmanan untuk acara keluarga, sekolah, kantor, komunitas, hingga dinas di Kabupaten Tegal. Mengutamakan rasa, kerapian, dan pelayanan amanah.",
  logoUrl: "/logo-rhf.png",
};
