import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import {
  skipFor,
  toPaged,
  type Paged,
  type TableParams,
} from "@/lib/admin/pagination";
import { db } from "@/lib/db";
import { parseList } from "@/lib/json-list";

/**
 * List reads for the admin panel.
 *
 * Separate from `lib/repositories/` for the reason stated there: that layer
 * strips `isPublished: false` before returning, which is right for visitors and
 * useless for an editor who needs to see and re-publish hidden records.
 *
 * Rows come back as Prisma returns them — `null` rather than absent, `Date`
 * rather than ISO string. Admin forms want exactly that shape, so there is no
 * mapper here; `repositories/mappers.ts` exists for the public types only.
 *
 * Every list is paginated and filtered **in the database**. Fetching the
 * collection and slicing it in the component would look identical on a
 * thirteen-row table and stop working long before anyone noticed why.
 *
 * There are no single-record reads. Every form opens in a drawer over a row
 * that is already on screen, so the record it edits came back with the page —
 * a second query by id would fetch what the browser is already holding.
 */

const bySortOrder = [{ sortOrder: "asc" }, { createdAt: "asc" }] as const;

/**
 * `LIKE %term%`.
 *
 * No `mode: "insensitive"` — SQLite does not accept it, and does not need it:
 * its `LIKE` already ignores case for ASCII, which is what Indonesian package
 * names and descriptions are. Accented letters would not match case-insensitively,
 * which is the one behavioural difference from Postgres and does not arise here.
 */
function like(q: string): Prisma.StringFilter {
  return { contains: q };
}

/**
 * Runs the count and the page in one round trip.
 *
 * The count has to happen first in logical terms — it decides how many pages
 * there are, and therefore whether the requested page exists — but both
 * queries can be in flight at once, and a page that turns out to be past the
 * end simply comes back empty and gets clamped by `toPaged`.
 */
async function paginate<Row>(
  params: TableParams,
  count: () => Promise<number>,
  fetch: (skip: number, take: number) => Promise<Row[]>,
): Promise<Paged<Row>> {
  const total = await count();
  const pageCount = Math.max(1, Math.ceil(total / params.perPage));
  const rows = await fetch(skipFor(params, pageCount), params.perPage);

  return toPaged(rows, total, params);
}

/** Next unused position, read from the whole table rather than one page. */
async function nextSortOrder(
  aggregate: () => Promise<{ _max: { sortOrder: number | null } }>,
): Promise<number> {
  const { _max } = await aggregate();

  return (_max.sortOrder ?? -1) + 1;
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export function listFaqs(params: TableParams) {
  const where: Prisma.FaqWhereInput = params.q
    ? { OR: [{ question: like(params.q) }, { answer: like(params.q) }] }
    : {};

  return paginate(
    params,
    () => db.faq.count({ where }),
    (skip, take) =>
      db.faq.findMany({ where, orderBy: [...bySortOrder], skip, take }),
  );
}

export const nextFaqSortOrder = () =>
  nextSortOrder(() => db.faq.aggregate({ _max: { sortOrder: true } }));

// ── Kategori ────────────────────────────────────────────────────────────────

export function listCategories(params: TableParams) {
  const where: Prisma.MenuCategoryWhereInput = params.q
    ? {
        OR: [
          { name: like(params.q) },
          { slug: like(params.q) },
          { description: like(params.q) },
        ],
      }
    : {};

  return paginate(
    params,
    () => db.menuCategory.count({ where }),
    (skip, take) =>
      db.menuCategory.findMany({ where, orderBy: [...bySortOrder], skip, take }),
  );
}

/**
 * Every category, unpaginated — the menu form's checkbox list.
 *
 * Deliberately not the paginated one: a package can belong to any category,
 * so offering only the first page would silently make the rest unassignable.
 */
export function listCategoryOptions() {
  return db.menuCategory.findMany({
    orderBy: [...bySortOrder],
    select: { id: true, name: true, isPublished: true },
  });
}

export const nextCategorySortOrder = () =>
  nextSortOrder(() => db.menuCategory.aggregate({ _max: { sortOrder: true } }));

// ── Menu ────────────────────────────────────────────────────────────────────

/**
 * Menu packages, each already carrying what both the table and the drawer need.
 *
 * The drawer edits a record that is already on screen, so loading the full row
 * for the current page costs one query instead of a round trip on every pencil
 * click. The join is flattened here so no component downstream has to know the
 * join table exists.
 */
export async function listMenuItems(params: TableParams) {
  const where: Prisma.MenuItemWhereInput = params.q
    ? {
        OR: [
          { name: like(params.q) },
          { description: like(params.q) },
          { slug: like(params.q) },
          // `tags` is a JSON array in one column now, so this searches the
          // stored text rather than the elements. For badge labels that is the
          // same answer — and a term long enough to collide with JSON syntax
          // would not be a plausible search anyway.
          { tags: like(params.q) },
        ],
      }
    : {};

  const page = await paginate(
    params,
    () => db.menuItem.count({ where }),
    (skip, take) =>
      db.menuItem.findMany({
        where,
        orderBy: [...bySortOrder],
        skip,
        take,
        include: {
          categories: {
            select: { category: { select: { id: true, name: true } } },
            orderBy: { category: { sortOrder: "asc" } },
          },
        },
      }),
  );

  return {
    ...page,
    // The three list columns are unpacked here for the same reason the mapper
    // unpacks them for public pages: the drawer's form seeds a textarea from
    // `string[]`, and should not have to know the column holds JSON.
    rows: page.rows.map(({ categories, ...item }) => ({
      ...item,
      packageItems: parseList(item.packageItems),
      galleryImages: parseList(item.galleryImages),
      tags: parseList(item.tags),
      categoryIds: categories.map((link) => link.category.id),
      categoryNames: categories.map((link) => link.category.name),
    })),
  };
}

export const nextMenuItemSortOrder = () =>
  nextSortOrder(() => db.menuItem.aggregate({ _max: { sortOrder: true } }));

// ── Galeri ──────────────────────────────────────────────────────────────────

export function listGalleryItems(params: TableParams) {
  const where: Prisma.GalleryItemWhereInput = params.q
    ? {
        OR: [
          { title: like(params.q) },
          { caption: like(params.q) },
          { category: like(params.q) },
        ],
      }
    : {};

  return paginate(
    params,
    () => db.galleryItem.count({ where }),
    (skip, take) =>
      db.galleryItem.findMany({ where, orderBy: [...bySortOrder], skip, take }),
  );
}

export const nextGallerySortOrder = () =>
  nextSortOrder(() => db.galleryItem.aggregate({ _max: { sortOrder: true } }));

// ── Testimoni ───────────────────────────────────────────────────────────────

export function listTestimonials(params: TableParams) {
  const where: Prisma.TestimonialWhereInput = params.q
    ? {
        OR: [
          { customerName: like(params.q) },
          { customerType: like(params.q) },
          { message: like(params.q) },
        ],
      }
    : {};

  return paginate(
    params,
    () => db.testimonial.count({ where }),
    (skip, take) =>
      db.testimonial.findMany({ where, orderBy: [...bySortOrder], skip, take }),
  );
}

export const nextTestimonialSortOrder = () =>
  nextSortOrder(() => db.testimonial.aggregate({ _max: { sortOrder: true } }));

// ── Client ──────────────────────────────────────────────────────────────────

export function listClients(params: TableParams) {
  const where: Prisma.ClientWhereInput = params.q
    ? { OR: [{ name: like(params.q) }, { category: like(params.q) }] }
    : {};

  return paginate(
    params,
    () => db.client.count({ where }),
    (skip, take) =>
      db.client.findMany({ where, orderBy: [...bySortOrder], skip, take }),
  );
}

export const nextClientSortOrder = () =>
  nextSortOrder(() => db.client.aggregate({ _max: { sortOrder: true } }));

// ── Lain-lain ───────────────────────────────────────────────────────────────

/**
 * Categories cannot be deleted blindly: the join table cascades, so removing
 * one silently strips it from every package that used it. The list page shows
 * this count so the consequence is visible before the click.
 */
export async function countMenuItemsPerCategory(): Promise<
  Record<string, number>
> {
  const rows = await db.menuItemCategory.groupBy({
    by: ["categoryId"],
    _count: { menuItemId: true },
  });

  return Object.fromEntries(
    rows.map((row) => [row.categoryId, row._count.menuItemId]),
  );
}
