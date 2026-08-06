import type { MenuItem, SortOption } from "@/lib/types";

/**
 * Catalogue filtering and sorting — PRD §11.5.
 *
 * Kept as pure functions so the server can render a filtered first paint from
 * `searchParams` and the client can re-filter without a round trip, both using
 * exactly the same logic.
 */

export type CatalogFilters = {
  /** Category id, or `"all"`. */
  category: string;
  /** Free-text query matched against name, description, and package contents. */
  query: string;
  sort: SortOption;
};

export const DEFAULT_FILTERS: CatalogFilters = {
  category: "all",
  query: "",
  sort: "rekomendasi",
};

function matchesQuery(item: MenuItem, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    item.name,
    // The full description, not the card excerpt: searching used to miss words
    // that sat past the summary, which is most of what a package says about
    // itself.
    item.description,
    item.suitableFor ?? "",
    ...(item.packageItems ?? []),
    ...(item.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

/**
 * Quote-only packages have no numeric price. They sort last in both price
 * directions rather than being treated as free or infinitely expensive.
 */
function byPrice(a: MenuItem, b: MenuItem, direction: "asc" | "desc"): number {
  if (a.price === undefined && b.price === undefined) {
    return a.sortOrder - b.sortOrder;
  }
  if (a.price === undefined) return 1;
  if (b.price === undefined) return -1;

  return direction === "asc" ? a.price - b.price : b.price - a.price;
}

export function filterAndSortMenuItems(
  items: MenuItem[],
  filters: CatalogFilters,
): MenuItem[] {
  const filtered = items.filter((item) => {
    const inCategory =
      filters.category === "all" ||
      item.categoryIds.includes(filters.category);

    return inCategory && matchesQuery(item, filters.query);
  });

  const sorted = [...filtered];

  switch (filters.sort) {
    case "termurah":
      sorted.sort((a, b) => byPrice(a, b, "asc"));
      break;
    case "termahal":
      sorted.sort((a, b) => byPrice(a, b, "desc"));
      break;
    case "terbaru":
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "rekomendasi":
    default:
      // Featured packages first, then the admin-defined display order.
      sorted.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        return a.sortOrder - b.sortOrder;
      });
      break;
  }

  return sorted;
}

/** Reads filters out of a URL query string, falling back to defaults. */
export function parseFilters(params: {
  kategori?: string;
  cari?: string;
  urutkan?: string;
}): CatalogFilters {
  const sort = params.urutkan;
  const isValidSort = (v: string | undefined): v is SortOption =>
    v === "rekomendasi" || v === "terbaru" || v === "termurah" || v === "termahal";

  return {
    category: params.kategori || DEFAULT_FILTERS.category,
    query: params.cari || DEFAULT_FILTERS.query,
    sort: isValidSort(sort) ? sort : DEFAULT_FILTERS.sort,
  };
}
