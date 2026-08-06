import type { Faq } from "@/lib/types";

/**
 * FAQ content covering PRD §11.10 and PromtCatering §15.
 *
 * Answers are deliberately non-committal where PRD §27 records that the policy
 * is not settled yet — payment terms, delivery fees, and order cut-off all say
 * the admin confirms at order time rather than stating a rule RHF has not
 * agreed to. Update these through the admin panel once the rules are fixed.
 */
export const FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "Apakah RHF melayani pesanan di seluruh Kabupaten Tegal?",
    answer:
      "Ya. Area layanan utama RHF Catering & Snack Box adalah Kabupaten Tegal dan sekitarnya. Untuk lokasi yang agak jauh dari titik dapur, silakan konfirmasikan alamat acara lebih dulu melalui WhatsApp agar admin dapat memastikan jadwal pengiriman.",
    sortOrder: 1,
    isPublished: true,
  },
  {
    id: "faq-2",
    question: "Apakah bisa pesan untuk acara dinas, kantor, atau sekolah?",
    answer:
      "Bisa. RHF terbiasa melayani konsumsi rapat, kegiatan instansi, acara sekolah, dan pelatihan, baik dalam bentuk snack box, nasi box, coffee break, maupun kombinasi ketiganya dalam satu kegiatan.",
    sortOrder: 2,
    isPublished: true,
  },
  {
    id: "faq-3",
    question: "Berapa minimal order untuk setiap paket?",
    answer:
      "Minimal order berbeda untuk tiap paket dan tercantum pada halaman detail masing-masing menu. Bila pada suatu paket tertulis Hubungi Admin, berarti jumlah minimalnya menyesuaikan kebutuhan acara dan akan dikonfirmasi saat pemesanan.",
    sortOrder: 3,
    isPublished: true,
  },
  {
    id: "faq-4",
    question: "Apakah menu bisa disesuaikan dengan permintaan?",
    answer:
      "Bisa. Isi paket dapat disesuaikan, misalnya mengganti lauk utama, menyesuaikan tingkat kepedasan, atau mengubah jenis kudapan. Sampaikan kebutuhan Anda saat konsultasi agar admin dapat menyusun pilihan yang sesuai.",
    sortOrder: 4,
    isPublished: true,
  },
  {
    id: "faq-5",
    question: "Apakah harga bisa menyesuaikan anggaran?",
    answer:
      "Harga pada katalog adalah harga mulai dari, dan dapat berubah mengikuti isi paket serta jumlah pesanan. Sampaikan anggaran per box atau per pax yang Anda miliki, lalu admin akan membantu menyusun paket yang paling mendekati kebutuhan tersebut.",
    sortOrder: 5,
    isPublished: true,
  },
  {
    id: "faq-6",
    question: "Bagaimana cara memesan?",
    answer:
      "Pilih paket pada katalog menu, lalu tekan tombol Pesan via WhatsApp. Pesan akan terbuka otomatis berisi nama paket dan harga. Lengkapi jumlah pesanan, tanggal acara, dan lokasi, kemudian kirimkan kepada admin RHF untuk dikonfirmasi.",
    sortOrder: 6,
    isPublished: true,
  },
  {
    id: "faq-7",
    question: "Kapan sebaiknya pesanan dilakukan?",
    answer:
      "Semakin awal semakin baik, terutama untuk pesanan dalam jumlah besar atau pada musim acara yang ramai. Silakan hubungi admin untuk memastikan ketersediaan tanggal acara Anda sebelum melakukan pemesanan.",
    sortOrder: 7,
    isPublished: true,
  },
  {
    id: "faq-8",
    question: "Bagaimana sistem pembayarannya?",
    answer:
      "Detail pembayaran, termasuk uang muka bila diperlukan, dikonfirmasi langsung oleh admin RHF melalui WhatsApp saat pesanan disepakati. Ketentuannya disesuaikan dengan jenis dan jumlah pesanan.",
    sortOrder: 8,
    isPublished: true,
  },
  {
    id: "faq-9",
    question: "Apakah tersedia layanan pengiriman?",
    answer:
      "Pesanan dapat dikirim ke lokasi acara maupun diambil sendiri, sesuai kesepakatan. Ketersediaan dan biaya pengiriman menyesuaikan jarak serta jumlah pesanan, dan akan diinformasikan admin saat konfirmasi.",
    sortOrder: 9,
    isPublished: true,
  },
  {
    id: "faq-10",
    question: "Apakah bisa berkonsultasi dulu sebelum memesan?",
    answer:
      "Tentu. Anda dapat menghubungi admin RHF melalui WhatsApp untuk berdiskusi mengenai pilihan menu, perkiraan porsi, dan penyesuaian anggaran, tanpa kewajiban langsung melakukan pemesanan.",
    sortOrder: 10,
    isPublished: true,
  },
];
