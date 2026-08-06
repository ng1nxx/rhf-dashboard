import type { MenuCategory } from "@/lib/types";

/**
 * The nine service categories mandated by PRD §8, split in the UI into
 * product-based (first four) and event-based (remaining five) groups.
 * Descriptions are the approved copy from PRD §13.2.
 */
export const CATEGORIES: MenuCategory[] = [
  {
    id: "cat-snack-box",
    name: "Snack Box",
    slug: "snack-box",
    description:
      "Pilihan snack box rapi dan praktis untuk rapat, acara sekolah, pengajian, arisan, hingga kegiatan kantor.",
    icon: "box",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "cat-nasi-box",
    name: "Nasi Box",
    slug: "nasi-box",
    description:
      "Nasi box lengkap untuk makan siang, acara dinas, sekolah, kantor, dan kebutuhan konsumsi acara keluarga.",
    icon: "utensils",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "cat-prasmanan",
    name: "Prasmanan",
    slug: "prasmanan",
    description:
      "Menu prasmanan untuk acara keluarga, syukuran, pengajian, pernikahan, dan event dengan jumlah tamu lebih banyak.",
    icon: "soup",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "cat-coffee-break",
    name: "Coffee Break",
    slug: "coffee-break",
    description:
      "Paket coffee break untuk rapat, seminar, pelatihan, dan kegiatan formal maupun semi-formal.",
    icon: "coffee",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "cat-rapat-dinas",
    name: "Paket Rapat/Dinas",
    slug: "paket-rapat-dinas",
    description:
      "Paket konsumsi yang cocok untuk kebutuhan rapat, kegiatan instansi, dan acara kantor.",
    icon: "briefcase",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "cat-sekolah",
    name: "Paket Sekolah",
    slug: "paket-sekolah",
    description:
      "Paket praktis untuk kegiatan sekolah, rapat guru, acara murid, lomba, dan agenda pendidikan.",
    icon: "school",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "cat-pengajian",
    name: "Pengajian/Syukuran",
    slug: "pengajian-syukuran",
    description:
      "Pilihan menu untuk acara pengajian, syukuran, tasyakuran, dan acara keluarga lainnya.",
    icon: "hands",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "cat-pernikahan",
    name: "Pernikahan",
    slug: "pernikahan",
    description:
      "Layanan konsumsi dan prasmanan untuk acara pernikahan dengan menu yang bisa dikonsultasikan sesuai kebutuhan.",
    icon: "heart",
    sortOrder: 8,
    isPublished: true,
  },
  {
    id: "cat-aqiqah",
    name: "Aqiqah",
    slug: "aqiqah",
    description:
      "Paket konsumsi untuk acara aqiqah dan syukuran keluarga dengan rasa yang tetap menjadi prioritas utama.",
    icon: "baby",
    sortOrder: 9,
    isPublished: true,
  },
];

/** Categories describing a product form factor — PRD §8.1.A. */
export const PRODUCT_CATEGORY_SLUGS = [
  "snack-box",
  "nasi-box",
  "prasmanan",
  "coffee-break",
];

/** Categories describing an event need — PRD §8.1.B. */
export const EVENT_CATEGORY_SLUGS = [
  "paket-rapat-dinas",
  "paket-sekolah",
  "pengajian-syukuran",
  "pernikahan",
  "aqiqah",
];
