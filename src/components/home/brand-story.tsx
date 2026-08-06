import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { FoodPlaceholder } from "@/components/shared/food-placeholder";
import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

/**
 * Brand story — DesignRHF §17.
 *
 * The RHF acronym is the emotional core of the brand (PRD §1), so the three
 * names are pulled out as their own element rather than buried in prose.
 */
export function BrandStory() {
  return (
    <Section tone="cream">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-xl border border-rhf-border bg-white shadow-rhf-md">
            <div className="relative aspect-5/4">
              <FoodPlaceholder
                category="Dapur/Proses"
                label="Foto dapur & proses"
              />
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-5 lg:order-2">
          <span className="text-xs font-semibold tracking-[0.16em] text-rhf-deep-orange uppercase">
            Cerita RHF
          </span>

          <h2 className="font-heading text-[1.75rem] font-bold text-rhf-charcoal sm:text-[2rem] lg:text-[2.5rem]">
            Berawal dari Usaha Keluarga, Tumbuh karena Rasa
          </h2>

          <div className="flex flex-wrap gap-2">
            {["Rafi", "Hafizh", "Fatih"].map((name) => (
              <span
                key={name}
                className="rounded-full border border-rhf-border bg-white px-4 py-2 font-heading text-sm font-semibold text-rhf-brown"
              >
                {name}
              </span>
            ))}
          </div>

          <p className="max-w-[45rem] leading-relaxed text-muted-foreground">
            Nama RHF diambil dari nama anak-anak pemilik, yaitu Rafi, Hafizh,
            dan Fatih. Usaha ini dirintis dari nol, berawal dari berjualan
            sederhana, lalu berkembang hingga dipercaya melayani berbagai
            pesanan, termasuk kebutuhan acara dari client dan instansi.
          </p>

          <p className="max-w-[45rem] leading-relaxed text-muted-foreground">
            Bagi RHF, makanan bukan hanya soal mengenyangkan. Rasa, kerapian,
            dan kepercayaan adalah hal utama dalam setiap pesanan yang kami
            kerjakan.
          </p>

          <Button asChild variant="rhfOutline" size="rhf" className="mt-1">
            <Link href="/tentang">
              Selengkapnya tentang RHF
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
