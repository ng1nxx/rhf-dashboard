import { HeartHandshake, PackageCheck, Sparkles, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";

import { LogoMark } from "@/components/brand/logo";
import { CtaBlock } from "@/components/shared/cta-block";
import { FoodPlaceholder } from "@/components/shared/food-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { Section, SectionHeading } from "@/components/shared/section";
import { getSiteSettings } from "@/lib/repositories";
import { buildGlobalInquiry } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Tentang RHF Catering",
  description:
    "Cerita RHF Catering & Snack Box: usaha keluarga dari Kabupaten Tegal yang dirintis dari berjualan sederhana hingga dipercaya melayani acara keluarga, sekolah, kantor, dan instansi.",
  alternates: { canonical: "/tentang" },
};

/** Brand values — DesignRHF §1 "Nilai Utama Brand". */
const VALUES = [
  {
    icon: UtensilsCrossed,
    title: "Mengutamakan Rasa",
    description:
      "Rasa adalah janji utama RHF. Setiap menu disiapkan agar layak disajikan untuk tamu Anda.",
  },
  {
    icon: HeartHandshake,
    title: "Amanah dan Terpercaya",
    description:
      "Pesanan dikerjakan sesuai kesepakatan, mulai dari isi menu, jumlah, hingga waktu pengiriman.",
  },
  {
    icon: PackageCheck,
    title: "Rapi dan Profesional",
    description:
      "Kemasan dan penyajian dijaga rapi agar pantas untuk acara keluarga maupun kegiatan instansi.",
  },
  {
    icon: Sparkles,
    title: "Hangat dan Kekeluargaan",
    description:
      "Brand ini lahir dari cerita keluarga, dan cara kami melayani pelanggan mengikuti nilai itu.",
  },
];

/** Milestones from PRD §1 — kept qualitative because no dates are on record. */
const JOURNEY = [
  {
    title: "Merintis dari berjualan sederhana",
    description:
      "Usaha dirintis dari berjualan sederhana, dengan modal seadanya dan fokus pada rasa.",
  },
  {
    title: "Pesanan mulai berdatangan",
    description:
      "Pelanggan yang puas mulai memesan kembali untuk acara keluarga, pengajian, dan kegiatan sekolah.",
  },
  {
    title: "Melayani snack box dan nasi box",
    description:
      "Permintaan konsumsi acara membuat RHF menyiapkan paket box yang praktis dan mudah dibagikan.",
  },
  {
    title: "Dipercaya client dan instansi",
    description:
      "RHF kini juga melayani kebutuhan konsumsi rapat, pelatihan, dan kegiatan dinas di Kabupaten Tegal.",
  },
];

export default async function TentangPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Berawal dari Usaha Keluarga, Tumbuh karena Rasa"
        description="RHF Catering & Snack Box adalah usaha catering keluarga di Kabupaten Tegal yang tumbuh karena kepercayaan pelanggan."
      />

      <Section tone="cream">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2 className="font-heading text-2xl font-bold text-rhf-charcoal">
              Arti nama RHF
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                { initial: "R", name: "Rafi" },
                { initial: "H", name: "Hafizh" },
                { initial: "F", name: "Fatih" },
              ].map((child) => (
                <div
                  key={child.name}
                  className="flex items-center gap-3 rounded-lg border border-rhf-border bg-white px-4 py-3"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-rhf-orange font-heading text-lg font-bold text-white">
                    {child.initial}
                  </span>
                  <span className="font-heading font-semibold text-rhf-charcoal">
                    {child.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="leading-relaxed text-muted-foreground">
              Nama RHF diambil dari nama anak-anak pemilik: Rafi, Hafizh, dan
              Fatih. Ketiganya menjadi bagian dari semangat usaha ini sejak
              awal, dan namanya dibawa di setiap pesanan yang kami kerjakan.
            </p>

            <p className="leading-relaxed text-muted-foreground">
              Berawal dari merintis usaha dengan berjualan sederhana, RHF terus
              berkembang hingga dipercaya melayani berbagai pesanan, termasuk
              kebutuhan acara dari client dan instansi di Kabupaten Tegal.
            </p>

            <p className="leading-relaxed text-muted-foreground">
              Bagi RHF, makanan bukan hanya soal mengenyangkan. Rasa, kerapian,
              dan kepercayaan adalah hal utama dalam setiap pesanan, sekecil apa
              pun jumlahnya.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-xl border border-rhf-border bg-white shadow-rhf-md">
              <div className="relative aspect-5/4">
                <FoodPlaceholder
                  category="Dapur/Proses"
                  label="Foto pemilik & dapur"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-rhf-border bg-white p-5">
              <LogoMark size={56} />
              <div>
                <p className="font-heading font-bold text-rhf-charcoal">
                  {settings.tagline}
                </p>
                <p className="text-sm text-muted-foreground">
                  {settings.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Nilai Kami"
          title="Yang Kami Jaga di Setiap Pesanan"
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <li
              key={value.title}
              className="flex gap-4 rounded-lg border border-rhf-border bg-rhf-cream p-6"
            >
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-rhf-deep-orange">
                <value.icon aria-hidden strokeWidth={1.75} className="size-6" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-rhf-charcoal">
                  {value.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="soft">
        <SectionHeading
          eyebrow="Perjalanan"
          title="Perjalanan RHF Catering"
          description="Tumbuh perlahan, satu pesanan pada satu waktu."
        />

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-3 rounded-lg border border-rhf-border bg-white p-6"
            >
              <span
                aria-hidden
                className="font-heading text-3xl font-extrabold text-rhf-orange/25"
              >
                {String(index + 1).padStart(2, "0")}
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
      </Section>

      <CtaBlock
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={buildGlobalInquiry(settings)}
        title="Percayakan konsumsi acara Anda kepada RHF"
        description="Kami siap membantu kebutuhan snack box, nasi box, prasmanan, dan coffee break untuk acara Anda di Kabupaten Tegal."
      />
    </>
  );
}
