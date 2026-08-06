import { Section, SectionHeading } from "@/components/shared/section";

/**
 * Ordering steps — PRD §11.11.
 *
 * Step 5 deliberately avoids stating payment terms: PRD §27 item 3 records
 * that RHF has not settled them, so the copy says the admin confirms rather
 * than inventing a rule the business has not agreed to.
 */
const STEPS = [
  {
    title: "Pilih menu atau konsultasi",
    description:
      "Telusuri katalog paket, atau langsung sampaikan kebutuhan acara Anda bila belum yakin memilih menu.",
  },
  {
    title: "Hubungi admin via WhatsApp",
    description:
      "Tekan tombol Pesan via WhatsApp. Pesan sudah otomatis berisi nama paket dan harga yang Anda pilih.",
  },
  {
    title: "Lengkapi detail pesanan",
    description:
      "Sampaikan jumlah pesanan, tanggal acara, lokasi, serta catatan khusus bila ada.",
  },
  {
    title: "Konfirmasi dari admin RHF",
    description:
      "Admin mengonfirmasi ketersediaan tanggal, rincian menu, harga akhir, dan ketentuan pembayaran.",
  },
  {
    title: "Pesanan disiapkan dan dikirim",
    description:
      "Pesanan dimasak, dikemas rapi, lalu dikirim atau diambil sesuai kesepakatan.",
  },
];

export function OrderingFlow({ tone = "white" }: { tone?: "white" | "cream" }) {
  return (
    <Section tone={tone} id="cara-pemesanan">
      <SectionHeading
        eyebrow="Cara Pemesanan"
        title="Pesan dalam Lima Langkah"
        description="Tidak perlu membuat akun dan tidak ada formulir panjang. Semua pemesanan diselesaikan langsung bersama admin melalui WhatsApp."
      />

      <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="flex flex-col gap-3 rounded-lg border border-rhf-border bg-rhf-cream p-6"
          >
            <span
              aria-hidden
              className="inline-flex size-10 items-center justify-center rounded-full bg-rhf-orange font-heading text-base font-bold text-white"
            >
              {index + 1}
            </span>
            <h3 className="font-heading text-base font-bold text-rhf-charcoal">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 rounded-lg border border-rhf-border bg-white p-5 text-center text-sm text-muted-foreground">
        Detail pembayaran dan konfirmasi pesanan akan dibantu langsung oleh
        admin RHF melalui WhatsApp.
      </p>
    </Section>
  );
}
