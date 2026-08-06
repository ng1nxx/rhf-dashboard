import type { GalleryItem } from "@/lib/types";

/**
 * PLACEHOLDER GALLERY — no `imageUrl` is set on any entry.
 *
 * PRD §14 requires real photography before production. Every item here renders
 * through `<FoodPlaceholder>` instead of a photo, so the grid, filtering, and
 * lightbox can be reviewed now and each slot filled in later without touching
 * the templates. Captions describe the shot that PRD §14.1 asks to be taken.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Snack box siap kirim",
    caption: "Snack box tertutup, tersusun rapi sebelum dikirim ke lokasi acara.",
    category: "Snack Box",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "gal-2",
    title: "Isi snack box",
    caption: "Tampilan isi snack box dari atas dengan tiga jenis kudapan.",
    category: "Snack Box",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "gal-3",
    title: "Nasi box lengkap",
    caption: "Nasi box terbuka dengan nasi, lauk, sayur, dan pelengkap.",
    category: "Nasi Box",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "gal-4",
    title: "Nasi box siap bagi",
    caption: "Susunan nasi box tertutup untuk konsumsi kegiatan kantor.",
    category: "Nasi Box",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "gal-5",
    title: "Meja prasmanan",
    caption: "Penataan meja prasmanan untuk acara keluarga.",
    category: "Prasmanan",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "gal-6",
    title: "Detail menu prasmanan",
    caption: "Detail lauk dan sayur pada sajian prasmanan.",
    category: "Prasmanan",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "gal-7",
    title: "Penataan coffee break",
    caption: "Meja coffee break lengkap dengan minuman panas dan kudapan.",
    category: "Coffee Break",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "gal-8",
    title: "Kudapan coffee break",
    caption: "Pilihan kudapan yang disajikan pada sesi coffee break.",
    category: "Coffee Break",
    sortOrder: 8,
    isPublished: true,
  },
  {
    id: "gal-9",
    title: "Konsumsi kegiatan instansi",
    caption: "Pengiriman konsumsi untuk kegiatan instansi di Kabupaten Tegal.",
    category: "Event/Dinas",
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: "gal-10",
    title: "Konsumsi acara sekolah",
    caption: "Penyiapan konsumsi untuk kegiatan sekolah.",
    category: "Event/Dinas",
    sortOrder: 10,
    isPublished: true,
  },
  {
    id: "gal-11",
    title: "Proses dapur",
    caption: "Proses memasak di dapur RHF dengan area kerja yang bersih.",
    category: "Dapur/Proses",
    sortOrder: 11,
    isPublished: true,
  },
  {
    id: "gal-12",
    title: "Proses packing",
    caption: "Proses packing pesanan sebelum dikirim ke lokasi acara.",
    category: "Dapur/Proses",
    sortOrder: 12,
    isPublished: true,
  },
];
