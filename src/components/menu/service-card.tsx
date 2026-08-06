import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/shared/category-icon";
import type { MenuCategory } from "@/lib/types";

/**
 * Service/category card — PRD §11.4.
 *
 * Links into the catalogue pre-filtered by this category, which is what PRD
 * §11.4 means by "klik layanan dapat memfilter katalog menu".
 */
export function ServiceCard({ category }: { category: MenuCategory }) {
  return (
    <article className="card-lift group relative flex flex-col gap-3 rounded-lg border border-rhf-border bg-white p-6 shadow-rhf-sm">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-rhf-cream text-rhf-deep-orange transition-colors group-hover:bg-rhf-orange group-hover:text-white">
        <CategoryIcon
          iconKey={category.icon}
          aria-hidden
          strokeWidth={1.75}
          className="size-6"
        />
      </span>

      <h3 className="font-heading text-lg font-bold text-rhf-charcoal">
        <Link
          href={`/menu?kategori=${category.slug}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-rhf-deep-orange"
        >
          {category.name}
        </Link>
      </h3>

      {category.description ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {category.description}
        </p>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-rhf-deep-orange">
        Lihat Paket
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      </span>
    </article>
  );
}
