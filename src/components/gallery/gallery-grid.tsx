"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { FoodPlaceholder } from "@/components/shared/food-placeholder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Gallery grid with category filter and lightbox — PRD §11.7.
 *
 * A Client Component because filtering and the lightbox are both local
 * interactions; the items themselves are fetched on the server and passed in.
 */
export function GalleryGrid({
  items,
  showFilter = true,
}: {
  items: GalleryItem[];
  showFilter?: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null);

  // Only offer filters for categories that actually have published photos.
  const categories = useMemo(() => {
    const present = new Set<string>();
    for (const item of items) {
      if (item.category) present.add(item.category);
    }
    return Array.from(present);
  }, [items]);

  const visible = useMemo(
    () =>
      activeCategory === "all"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-rhf-border bg-white p-10 text-center text-muted-foreground">
        Dokumentasi pesanan akan segera ditampilkan di sini.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {showFilter && categories.length > 1 ? (
        <div
          role="group"
          aria-label="Filter kategori galeri"
          className="flex flex-wrap justify-center gap-2"
        >
          <FilterChip
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          >
            Semua
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </FilterChip>
          ))}
        </div>
      ) : null}

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpenItem(item)}
              className="card-lift group block w-full overflow-hidden rounded-lg border border-rhf-border bg-white text-left shadow-rhf-sm focus-visible:ring-3 focus-visible:ring-rhf-orange/40"
            >
              <span className="relative block aspect-4/3 overflow-hidden bg-rhf-cream">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.caption ?? item.title ?? "Dokumentasi RHF Catering"}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <FoodPlaceholder category={item.category} />
                )}
              </span>

              {item.title ? (
                <span className="block px-4 py-3">
                  <span className="block font-heading text-sm font-semibold text-rhf-charcoal group-hover:text-rhf-deep-orange">
                    {item.title}
                  </span>
                  {item.category ? (
                    <span className="block text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={openItem !== null}
        onOpenChange={(next) => !next && setOpenItem(null)}
      >
        <DialogContent className="max-w-3xl overflow-hidden rounded-lg border-rhf-border bg-white p-0">
          {openItem ? (
            <>
              <DialogTitle className="sr-only">
                {openItem.title ?? "Dokumentasi RHF Catering"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {openItem.caption ?? "Dokumentasi pesanan RHF Catering."}
              </DialogDescription>

              <div className="relative aspect-4/3 w-full bg-rhf-cream">
                {openItem.imageUrl ? (
                  <Image
                    src={openItem.imageUrl}
                    alt={
                      openItem.caption ??
                      openItem.title ??
                      "Dokumentasi RHF Catering"
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-contain"
                  />
                ) : (
                  <FoodPlaceholder category={openItem.category} />
                )}
              </div>

              <div className="flex flex-col gap-1 p-6">
                <h2 className="font-heading text-lg font-bold text-rhf-charcoal">
                  {openItem.title ?? openItem.category}
                </h2>
                {openItem.caption ? (
                  <p className="text-sm text-muted-foreground">
                    {openItem.caption}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="rhf"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border-rhf-border",
        active
          ? "border-rhf-orange bg-rhf-orange text-white hover:bg-rhf-deep-orange hover:text-white"
          : "bg-white text-rhf-charcoal hover:bg-rhf-cream",
      )}
    >
      {children}
    </Button>
  );
}
