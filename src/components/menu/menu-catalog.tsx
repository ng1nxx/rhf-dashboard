"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { MenuCard } from "@/components/menu/menu-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_FILTERS,
  filterAndSortMenuItems,
  type CatalogFilters,
} from "@/lib/catalog";
import { SORT_OPTIONS, type MenuCategory, type MenuItem, type SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Catalogue with category filter, search, and sort — PRD §11.5.
 *
 * The server renders the first paint already filtered from the query string,
 * then this takes over for instant interaction. Both use the same pure
 * `filterAndSortMenuItems`, so the two never disagree.
 *
 * Filter state is mirrored back into the URL so a filtered view can be shared
 * and so `/layanan` can deep-link into a pre-filtered catalogue.
 */
export function MenuCatalog({
  items,
  categories,
  whatsappNumber,
  initialFilters,
}: {
  items: MenuItem[];
  categories: MenuCategory[];
  whatsappNumber: string;
  initialFilters: CatalogFilters;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  // Kept separate from `filters.query` so typing stays responsive while the
  // URL update is debounced.
  const [searchDraft, setSearchDraft] = useState(initialFilters.query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        current.query === searchDraft ? current : { ...current, query: searchDraft },
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [searchDraft]);

  // Mirror filters into the URL without adding history entries or scrolling.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== DEFAULT_FILTERS.category) {
      params.set("kategori", filters.category);
    }
    if (filters.query) params.set("cari", filters.query);
    if (filters.sort !== DEFAULT_FILTERS.sort) params.set("urutkan", filters.sort);

    const query = params.toString();
    router.replace(query ? `/menu?${query}` : "/menu", { scroll: false });
  }, [filters, router]);

  const visible = useMemo(
    () => filterAndSortMenuItems(items, filters),
    [items, filters],
  );

  const isFiltered =
    filters.category !== DEFAULT_FILTERS.category ||
    filters.query !== "" ||
    filters.sort !== DEFAULT_FILTERS.sort;

  function reset() {
    setSearchDraft("");
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <label htmlFor="cari-menu" className="sr-only">
              Cari nama menu atau paket
            </label>
            <Input
              id="cari-menu"
              type="search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Cari menu, misalnya snack box atau nasi"
              className="h-12 rounded-full border-rhf-border bg-white pl-11 text-base"
            />
          </div>

          <div className="sm:w-56">
            <label htmlFor="urutkan-menu" className="sr-only">
              Urutkan katalog
            </label>
            <Select
              value={filters.sort}
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  sort: value as SortOption,
                }))
              }
            >
              <SelectTrigger
                id="urutkan-menu"
                className="h-12! w-full rounded-full border-rhf-border bg-white text-base"
              >
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter kategori menu"
          className="flex flex-wrap gap-2"
        >
          <CategoryChip
            active={filters.category === "all"}
            onClick={() =>
              setFilters((current) => ({ ...current, category: "all" }))
            }
          >
            Semua Kategori
          </CategoryChip>

          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              active={filters.category === category.id}
              onClick={() =>
                setFilters((current) => ({ ...current, category: category.id }))
              }
            >
              {category.name}
            </CategoryChip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rhf-border pb-4">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          Menampilkan <strong className="text-rhf-charcoal">{visible.length}</strong>{" "}
          dari {items.length} paket
        </p>

        {isFiltered ? (
          <Button
            type="button"
            variant="ghost"
            size="rhf"
            onClick={reset}
            className="rounded-full text-rhf-deep-orange"
          >
            <X aria-hidden />
            Atur ulang filter
          </Button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-rhf-border bg-white p-10 text-center">
          <h2 className="font-heading text-lg font-bold text-rhf-charcoal">
            Paket tidak ditemukan
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Belum ada paket yang cocok dengan pencarian Anda. Coba kata kunci
            lain, atau hubungi admin RHF untuk menyusun paket sesuai kebutuhan
            acara.
          </p>
          <Button
            type="button"
            variant="rhfOutline"
            size="rhf"
            onClick={reset}
            className="mt-6"
          >
            Tampilkan semua paket
          </Button>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <li key={item.id} className="flex">
              <MenuCard
                item={item}
                categories={categories}
                whatsappNumber={whatsappNumber}
                priority={index < 3}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CategoryChip({
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
