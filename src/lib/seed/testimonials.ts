import type { Testimonial } from "@/lib/types";

/**
 * PLACEHOLDER TESTIMONIALS — these are NOT real customer quotes.
 *
 * PRD §13.3 item 6 and §27 item 6 record that genuine testimonials have not
 * been collected yet. They are seeded here only so the testimonial section can
 * be designed and reviewed.
 *
 * Replace every entry with a real, permitted quote before launch, or set them
 * all to `isPublished: false` — the section falls back to the general trust
 * copy required by PRD §11.9 when nothing is published. See PRELAUNCH.md.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    customerName: "Contoh — Panitia Kegiatan Kantor",
    customerType: "Kantor",
    message:
      "Pesanan snack box datang tepat waktu dan kemasannya rapi. Peserta rapat memberi tanggapan positif untuk rasanya.",
    rating: 5,
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "testi-2",
    customerName: "Contoh — Panitia Acara Sekolah",
    customerType: "Sekolah",
    message:
      "Jumlah pesanan cukup banyak tetapi tetap terkoordinasi dengan baik. Admin membantu menyesuaikan menu dengan anggaran panitia.",
    rating: 5,
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "testi-3",
    customerName: "Contoh — Keluarga Pemesan Syukuran",
    customerType: "Keluarga",
    message:
      "Menu prasmanan sesuai dengan yang dibicarakan sejak awal. Porsinya pas dan tamu merasa cukup.",
    rating: 5,
    sortOrder: 3,
    isPublished: true,
  },
];
