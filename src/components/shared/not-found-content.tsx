import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * The 404 body, shared by two `not-found.tsx` files.
 *
 * `(public)/not-found.tsx` catches misses inside the public site — an unknown
 * menu slug, say — and renders inside the public chrome. The root
 * `not-found.tsx` catches URLs that match no route group at all and has no
 * chrome to sit in, which is why the links below are part of the content rather
 * than left to the header.
 */
export function NotFoundContent() {
  return (
    <section className="section-y bg-rhf-cream">
      <div className="container-rhf flex flex-col items-center text-center">
        <span className="font-heading text-6xl font-extrabold text-rhf-orange/30">
          404
        </span>

        <h1 className="mt-4 font-heading text-[1.75rem] font-bold text-rhf-charcoal sm:text-[2rem]">
          Halaman tidak ditemukan
        </h1>

        <p className="mt-3 max-w-md text-muted-foreground">
          Halaman atau paket yang Anda cari mungkin sudah tidak tersedia. Silakan
          kembali ke beranda atau lihat katalog menu kami.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="rhf" size="rhf">
            <Link href="/">
              <Home aria-hidden />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button asChild variant="rhfOutline" size="rhf">
            <Link href="/menu">
              Lihat Katalog Menu
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
