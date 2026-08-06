import { HeartHandshake, PackageCheck, Soup, UtensilsCrossed } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";

/** "Kenapa Memilih RHF" — copy from DesignRHF §19. */
const REASONS = [
  {
    icon: UtensilsCrossed,
    title: "Mengutamakan Rasa",
    description:
      "Setiap menu dibuat dengan perhatian pada rasa agar cocok untuk berbagai acara, mulai dari kegiatan keluarga hingga acara instansi.",
  },
  {
    icon: PackageCheck,
    title: "Rapi dan Praktis",
    description:
      "Pesanan dikemas dengan rapi sehingga mudah dibagikan panitia dan siap disajikan begitu sampai di lokasi acara.",
  },
  {
    icon: Soup,
    title: "Cocok untuk Banyak Kebutuhan",
    description:
      "Melayani snack box, nasi box, prasmanan, coffee break, konsumsi rapat, acara sekolah, keluarga, dan kegiatan dinas.",
  },
  {
    icon: HeartHandshake,
    title: "Terpercaya",
    description:
      "Berawal dari usaha keluarga dan terus berkembang karena kepercayaan pelanggan yang kembali memesan.",
  },
];

export function WhyRhf() {
  return (
    <Section tone="soft">
      <SectionHeading
        eyebrow="Kenapa RHF"
        title="Kenapa Memilih RHF Catering?"
        description="Empat hal yang kami jaga di setiap pesanan, berapa pun jumlahnya."
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {REASONS.map((reason) => (
          <li
            key={reason.title}
            className="flex gap-4 rounded-lg border border-rhf-border bg-white p-6 shadow-rhf-sm"
          >
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-rhf-cream text-rhf-deep-orange">
              <reason.icon aria-hidden strokeWidth={1.75} className="size-6" />
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-rhf-charcoal">
                {reason.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
