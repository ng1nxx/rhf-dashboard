/**
 * String lists stored in a single SQLite column.
 *
 * SQLite has no array type, so the three list columns on `menu_items` —
 * `packageItems`, `galleryImages`, `tags` — hold a JSON array of strings. This
 * module is the only place that knows that: everything above it still works
 * with `string[]`, including the public `MenuItem` type, which is why moving
 * off Postgres needed no changes to a single page or component.
 *
 * A child table would have been the textbook answer. It buys nothing here —
 * nothing is shared between records, nothing is queried relationally, and
 * ordering is just insertion order — while costing three joins on every read
 * and three reconciliation transactions on every write.
 */

/**
 * Reads a stored column back as a list.
 *
 * Deliberately total: any value that is not a JSON array of strings yields an
 * empty list rather than throwing. These columns feed the public catalogue, and
 * one malformed row should cost a package its bullet points, not take down the
 * page for everyone.
 */
export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

/** Writes a list back to its column. */
export function serializeList(items: readonly string[]): string {
  return JSON.stringify(items);
}
