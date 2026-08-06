import type { PRICE_UNITS } from "@/lib/menu-text";
import type { MenuItem } from "@/lib/types";

/**
 * PLACEHOLDER CATALOGUE — replace before launch.
 *
 * PRD §13.3 and §27 record that the real menu list, prices, package contents,
 * and minimum orders are still outstanding. These entries exist so the
 * catalogue, filtering, and detail pages can be built and reviewed; prices
 * follow the indicative figures in PromtCatering.md §23.
 *
 * Note how several items carry more than one `categoryIds` entry — that is
 * PRD §8.2 in practice: a nasi box is simultaneously a Nasi Box, a Paket
 * Rapat/Dinas, and a Paket Sekolah depending on who is buying it.
 *
 * Every `description` is written so its FIRST SENTENCE stands on its own —
 * that sentence is what the catalogue card shows, cut by `excerpt()`. The
 * sentences after it only ever add detail, never restate the opening, so the
 * detail page does not read as if it says the same thing twice.
 */

/**
 * A seed row carries the stored columns only. `shortDescription` and
 * `priceLabel` are on the domain type but are computed in `toMenuItem`, so
 * putting them here would be writing down an answer the mapper already knows.
 */
type MenuItemSeed = Omit<MenuItem, "shortDescription" | "priceLabel"> & {
  priceUnit?: (typeof PRICE_UNITS)[number];
};

export const MENU_ITEMS: MenuItemSeed[] = [
  {
    id: "menu-snack-box-a",
    name: "Snack Box Paket A",
    slug: "snack-box-paket-a",
    description:
      "Tiga jenis kudapan dan air mineral dalam kemasan rapi, pilihan yang paling sering dipesan untuk rapat dan pengajian. Isinya kami susun seimbang antara gorengan, kue basah, dan roti manis, dan kombinasinya dapat disesuaikan dengan permintaan.",
    price: 15000,
    priceUnit: "box",
    minOrder: "Minimal 20 box",
    packageItems: [
      "Risoles atau lumpia",
      "Kue basah tradisional",
      "Roti manis",
      "Air mineral 220 ml",
    ],
    suitableFor:
      "Rapat kantor, pengajian, arisan, kegiatan sekolah, dan acara komunitas.",
    categoryIds: [
      "cat-snack-box",
      "cat-rapat-dinas",
      "cat-sekolah",
      "cat-pengajian",
    ],
    tags: ["Best Seller", "Cocok untuk Rapat"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 1,
    createdAt: "2026-07-01",
    seoTitle: "Snack Box Paket A — RHF Catering Kabupaten Tegal",
    seoDescription:
      "Snack box isi tiga kudapan dan air mineral, mulai Rp15.000 per box. Cocok untuk rapat, pengajian, dan acara sekolah di Kabupaten Tegal.",
  },
  {
    id: "menu-snack-box-b",
    name: "Snack Box Paket B",
    slug: "snack-box-paket-b",
    description:
      "Empat jenis kudapan dengan tambahan puding atau buah potong, untuk acara yang perlu tampil lebih lengkap. Sering dipilih untuk kegiatan setengah hari, pelatihan, atau tamu instansi yang membutuhkan sajian sedikit lebih istimewa.",
    price: 20000,
    priceUnit: "box",
    minOrder: "Minimal 20 box",
    packageItems: [
      "Pastel atau kroket",
      "Bolu potong",
      "Puding atau buah potong",
      "Kue kering",
      "Air mineral 220 ml",
    ],
    suitableFor:
      "Pelatihan, seminar, rapat instansi, dan kegiatan setengah hari.",
    categoryIds: ["cat-snack-box", "cat-rapat-dinas", "cat-coffee-break"],
    tags: ["Rekomendasi"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 2,
    createdAt: "2026-07-02",
  },
  {
    id: "menu-nasi-box-a",
    name: "Nasi Box Paket A",
    slug: "nasi-box-paket-a",
    description:
      "Nasi, ayam, mie, sayur, dan pelengkap dalam satu box praktis untuk makan siang acara. Porsinya mengenyangkan tanpa berlebihan, dikemas rapi sehingga aman dibawa dan mudah dibagikan di lokasi.",
    price: 25000,
    priceUnit: "box",
    minOrder: "Minimal 20 box",
    packageItems: [
      "Nasi putih",
      "Ayam goreng atau ayam bakar",
      "Mie goreng",
      "Oseng sayur",
      "Sambal dan kerupuk",
      "Air mineral 220 ml",
    ],
    suitableFor:
      "Makan siang rapat, kegiatan dinas, acara sekolah, dan konsumsi kegiatan kantor.",
    categoryIds: ["cat-nasi-box", "cat-rapat-dinas", "cat-sekolah"],
    tags: ["Best Seller", "Cocok untuk Rapat"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 3,
    createdAt: "2026-07-03",
    seoTitle: "Nasi Box Paket A — RHF Catering Kabupaten Tegal",
    seoDescription:
      "Nasi box lengkap mulai Rp25.000 per box untuk makan siang rapat, acara dinas, dan kegiatan sekolah di Kabupaten Tegal.",
  },
  {
    id: "menu-nasi-box-b",
    name: "Nasi Box Paket B",
    slug: "nasi-box-paket-b",
    description:
      "Nasi box dengan lauk lebih lengkap, tambahan telur balado dan buah potong. Dipilih untuk acara yang sajiannya perlu tampil lebih formal, misalnya tamu undangan pengajian atau kegiatan instansi dengan peserta dari luar kota. Menu utama dapat diganti sesuai permintaan.",
    price: 32000,
    priceUnit: "box",
    minOrder: "Minimal 20 box",
    packageItems: [
      "Nasi putih atau nasi uduk",
      "Ayam bakar bumbu rujak",
      "Telur balado",
      "Capcay atau tumis sayur",
      "Sambal, lalapan, dan kerupuk",
      "Buah potong",
      "Air mineral 220 ml",
    ],
    suitableFor:
      "Pengajian, syukuran, tamu instansi, dan acara keluarga yang lebih formal.",
    categoryIds: ["cat-nasi-box", "cat-rapat-dinas", "cat-pengajian"],
    tags: ["Rekomendasi"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 4,
    createdAt: "2026-07-04",
  },
  {
    id: "menu-nasi-box-sekolah",
    name: "Nasi Box Hemat Sekolah",
    slug: "nasi-box-hemat-sekolah",
    description:
      "Paket ekonomis dengan porsi menyesuaikan anak sekolah, tetap lengkap dan mengenyangkan. Tingkat kepedasan dibuat ramah untuk murid, dan kemasannya mudah dibagikan panitia untuk peserta dalam jumlah banyak.",
    price: 18000,
    priceUnit: "box",
    minOrder: "Minimal 30 box",
    packageItems: [
      "Nasi putih",
      "Ayam crispy atau telur balado",
      "Mie goreng",
      "Sayur tumis",
      "Kerupuk",
      "Air mineral 220 ml",
    ],
    suitableFor:
      "Lomba sekolah, kegiatan murid, rapat guru, dan acara ekstrakurikuler.",
    categoryIds: ["cat-nasi-box", "cat-sekolah"],
    tags: ["Cocok untuk Sekolah"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 5,
    createdAt: "2026-07-05",
  },
  {
    id: "menu-coffee-break",
    name: "Paket Coffee Break",
    slug: "paket-coffee-break",
    description:
      "Kopi, teh, dan dua jenis kudapan lengkap dengan perlengkapan saji untuk rapat dan pelatihan. Jumlah sesi dan jenis kudapan dikonsultasikan mengikuti rundown acara.",
    minOrder: "Hubungi Admin",
    packageItems: [
      "Kopi dan teh panas",
      "Dua jenis kudapan",
      "Air mineral",
      "Perlengkapan saji sederhana",
    ],
    suitableFor: "Seminar, pelatihan, rapat koordinasi, dan workshop instansi.",
    categoryIds: ["cat-coffee-break", "cat-rapat-dinas"],
    tags: ["Cocok untuk Rapat"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 6,
    createdAt: "2026-07-06",
  },
  {
    id: "menu-prasmanan-keluarga",
    name: "Prasmanan Paket Keluarga",
    slug: "prasmanan-paket-keluarga",
    description:
      "Menu prasmanan sederhana untuk acara keluarga, dihitung per pax dengan pilihan lauk yang fleksibel. Susunan menunya dipilih bersama admin, dan RHF membantu memperkirakan porsi sesuai jumlah tamu.",
    price: 35000,
    priceUnit: "pax",
    minOrder: "Minimal 50 pax",
    packageItems: [
      "Nasi putih",
      "Dua pilihan lauk utama",
      "Sayur atau capcay",
      "Sambal, lalapan, dan kerupuk",
      "Buah potong",
    ],
    suitableFor:
      "Syukuran, pengajian keluarga, arisan besar, dan acara di rumah.",
    categoryIds: ["cat-prasmanan", "cat-pengajian", "cat-pernikahan"],
    tags: ["Rekomendasi"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 7,
    createdAt: "2026-07-07",
  },
  {
    id: "menu-prasmanan-lengkap",
    name: "Prasmanan Paket Lengkap",
    slug: "prasmanan-paket-lengkap",
    description:
      "Prasmanan dengan pilihan lauk lebih banyak dan tambahan menu penutup untuk acara besar. Menu disusun bersama admin, mencakup lauk utama, olahan sayur, hidangan penutup, dan pelengkap. Kebutuhan peralatan saji dibahas saat konfirmasi pesanan.",
    price: 55000,
    priceUnit: "pax",
    minOrder: "Minimal 100 pax",
    packageItems: [
      "Nasi putih dan nasi goreng",
      "Tiga pilihan lauk utama",
      "Olahan sayur",
      "Hidangan penutup",
      "Sambal, lalapan, dan kerupuk",
      "Buah potong",
    ],
    suitableFor: "Resepsi pernikahan, syukuran besar, dan acara instansi.",
    categoryIds: ["cat-prasmanan", "cat-pernikahan"],
    tags: ["Paket Lengkap"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 8,
    createdAt: "2026-07-08",
  },
  {
    id: "menu-rapat-dinas",
    name: "Paket Rapat & Dinas",
    slug: "paket-rapat-dinas",
    description:
      "Kombinasi snack box, nasi box, dan coffee break dalam satu penawaran untuk kegiatan instansi. Snack pagi, makan siang, dan coffee break sore ditangani dalam satu koordinasi, termasuk rincian menu dan kebutuhan administrasinya.",
    minOrder: "Hubungi Admin",
    packageItems: [
      "Snack box sesi pagi",
      "Nasi box makan siang",
      "Coffee break sesi sore",
      "Pengiriman ke lokasi kegiatan",
    ],
    suitableFor:
      "Rapat dinas, kegiatan instansi, bimbingan teknis, dan pelatihan kantor.",
    categoryIds: [
      "cat-rapat-dinas",
      "cat-snack-box",
      "cat-nasi-box",
      "cat-coffee-break",
    ],
    tags: ["Cocok untuk Rapat", "Best Seller"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 9,
    createdAt: "2026-07-09",
    seoTitle: "Paket Rapat & Dinas — RHF Catering Kabupaten Tegal",
    seoDescription:
      "Paket konsumsi rapat dan kegiatan dinas di Kabupaten Tegal: snack box, nasi box, dan coffee break dalam satu koordinasi.",
  },
  {
    id: "menu-pengajian",
    name: "Paket Pengajian & Syukuran",
    slug: "paket-pengajian-syukuran",
    description:
      "Paket konsumsi untuk pengajian dan tasyakuran, tersedia dalam bentuk box maupun prasmanan. Nasi box untuk dibawa pulang jamaah, atau prasmanan bila tamu makan di tempat.",
    price: 28000,
    priceUnit: "pax",
    minOrder: "Minimal 50 pax",
    packageItems: [
      "Nasi putih atau nasi kuning",
      "Ayam bumbu atau rendang",
      "Mie atau bihun goreng",
      "Sayur pelengkap",
      "Kerupuk dan sambal",
    ],
    suitableFor: "Pengajian, tahlilan, tasyakuran, dan selamatan keluarga.",
    categoryIds: ["cat-pengajian", "cat-nasi-box", "cat-prasmanan"],
    isFeatured: true,
    isPublished: true,
    sortOrder: 10,
    createdAt: "2026-07-10",
  },
  {
    id: "menu-aqiqah",
    name: "Paket Aqiqah",
    slug: "paket-aqiqah",
    description:
      "Olahan kambing dan pelengkapnya untuk acara aqiqah, siap antar dalam box maupun prasmanan. Pilihan olahannya gulai, tongseng, atau sate, dan pembagian box disesuaikan dengan daftar penerima dari keluarga.",
    minOrder: "Hubungi Admin",
    packageItems: [
      "Olahan kambing pilihan",
      "Nasi putih atau nasi kebuli",
      "Acar dan pelengkap",
      "Kemasan box siap bagi",
    ],
    suitableFor: "Aqiqah, syukuran kelahiran, dan selamatan keluarga.",
    categoryIds: ["cat-aqiqah", "cat-nasi-box", "cat-prasmanan"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 11,
    createdAt: "2026-07-11",
  },
  {
    id: "menu-pernikahan",
    name: "Paket Pernikahan",
    slug: "paket-pernikahan",
    description:
      "Layanan prasmanan pernikahan dengan susunan menu yang dikonsultasikan sesuai konsep acara. Jumlah porsi dan kebutuhan peralatan saji dibahas langsung bersama admin RHF agar pas dengan anggaran.",
    minOrder: "Hubungi Admin",
    packageItems: [
      "Menu prasmanan sesuai konsultasi",
      "Hidangan penutup",
      "Peralatan saji",
      "Koordinasi penyajian di lokasi",
    ],
    suitableFor: "Resepsi pernikahan, lamaran, dan syukuran pernikahan.",
    categoryIds: ["cat-pernikahan", "cat-prasmanan"],
    isFeatured: false,
    isPublished: true,
    sortOrder: 12,
    createdAt: "2026-07-12",
  },
];
