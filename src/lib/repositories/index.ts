/**
 * Repository layer — the seam between pages and the data source.
 *
 * Pages import from here and nowhere else. Round 1 read the typed seed modules;
 * these bodies now query PostgreSQL through Prisma. The signatures and return
 * types are unchanged, which is why no page or component needed editing when
 * the database went live.
 *
 * Two rules are enforced here rather than at call sites, so a page cannot
 * forget them:
 *
 *   1. Records with `isPublished: false` never leave this module.
 *   2. Collections come back sorted by `sortOrder` ascending.
 *
 * Both are expressed as the shared `PUBLISHED` / `BY_SORT_ORDER` fragments
 * below, so adding a query means reusing them rather than restating them.
 *
 * The admin panel deliberately does NOT read through this module — it must see
 * unpublished records to edit them. Admin reads live in `lib/admin/`.
 */
import { db } from "@/lib/db";
import {
  toClient,
  toFaq,
  toGalleryItem,
  toMenuCategory,
  toMenuItem,
  toSiteSettings,
  toTestimonial,
} from "@/lib/repositories/mappers";
import { EVENT_CATEGORY_SLUGS, PRODUCT_CATEGORY_SLUGS } from "@/lib/seed/categories";
import type {
  Client,
  Faq,
  GalleryItem,
  MenuCategory,
  MenuItem,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/** Rule 1 — the publish gate, applied to every public read. */
const PUBLISHED = { isPublished: true } as const;

/** Rule 2 — the ordering contract callers rely on. */
const BY_SORT_ORDER = { sortOrder: "asc" } as const;

/** Category membership lives in a join table; every menu read needs it. */
const WITH_CATEGORY_IDS = {
  categories: { select: { categoryId: true } },
} as const;

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export async function getSiteSettings(): Promise<SiteSettings> {
  const row = await db.siteSettings.findUnique({ where: { id: "default" } });

  if (!row) {
    // Every WhatsApp CTA on the site reads its number from this row (PRD
    // §18.4). Falling back to defaults would silently point the entire
    // conversion path at a stale number, so this fails loudly instead.
    throw new Error(
      'Baris site_settings "default" tidak ditemukan. Jalankan `npm run db:seed`.',
    );
  }

  return toSiteSettings(row);
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<MenuCategory[]> {
  const rows = await db.menuCategory.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toMenuCategory);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<MenuCategory | null> {
  const row = await db.menuCategory.findFirst({
    where: { ...PUBLISHED, slug },
  });

  return row ? toMenuCategory(row) : null;
}

/** Categories describing a product form factor — PRD §8.1.A. */
export async function getProductCategories(): Promise<MenuCategory[]> {
  const rows = await db.menuCategory.findMany({
    where: { ...PUBLISHED, slug: { in: PRODUCT_CATEGORY_SLUGS } },
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toMenuCategory);
}

/** Categories describing an event need — PRD §8.1.B. */
export async function getEventCategories(): Promise<MenuCategory[]> {
  const rows = await db.menuCategory.findMany({
    where: { ...PUBLISHED, slug: { in: EVENT_CATEGORY_SLUGS } },
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toMenuCategory);
}

/* -------------------------------------------------------------------------- */
/* Menu items                                                                 */
/* -------------------------------------------------------------------------- */

export async function getMenuItems(): Promise<MenuItem[]> {
  const rows = await db.menuItem.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
    include: WITH_CATEGORY_IDS,
  });

  return rows.map(toMenuItem);
}

/** Homepage highlights — PRD §10.2 section 5. */
export async function getFeaturedMenuItems(limit = 6): Promise<MenuItem[]> {
  const rows = await db.menuItem.findMany({
    where: { ...PUBLISHED, isFeatured: true },
    orderBy: BY_SORT_ORDER,
    include: WITH_CATEGORY_IDS,
    take: limit,
  });

  return rows.map(toMenuItem);
}

export async function getMenuItemBySlug(
  slug: string,
): Promise<MenuItem | null> {
  const row = await db.menuItem.findFirst({
    where: { ...PUBLISHED, slug },
    include: WITH_CATEGORY_IDS,
  });

  return row ? toMenuItem(row) : null;
}

/** Slugs for `generateStaticParams` on `/menu/[slug]`. */
export async function getMenuItemSlugs(): Promise<string[]> {
  const rows = await db.menuItem.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
    select: { slug: true },
  });

  return rows.map((row) => row.slug);
}

/**
 * Other packages to suggest on a detail page — PRD §11.6.
 *
 * Prefers packages sharing a category with the current one, then tops up with
 * featured packages so the section is never short. The ranking stays in memory
 * because "shares at least one category, otherwise featured" is an ordering
 * preference rather than a filter, and the published catalogue is small enough
 * that a second round trip would cost more than it saves.
 */
export async function getRelatedMenuItems(
  item: MenuItem,
  limit = 3,
): Promise<MenuItem[]> {
  const rows = await db.menuItem.findMany({
    where: { ...PUBLISHED, id: { not: item.id } },
    orderBy: BY_SORT_ORDER,
    include: WITH_CATEGORY_IDS,
  });

  const others = rows.map(toMenuItem);

  const sameCategory = others.filter((m) =>
    m.categoryIds.some((id) => item.categoryIds.includes(id)),
  );

  const topUp = others.filter(
    (m) => m.isFeatured && !sameCategory.some((s) => s.id === m.id),
  );

  return [...sameCategory, ...topUp].slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Gallery                                                                    */
/* -------------------------------------------------------------------------- */

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const rows = await db.galleryItem.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toGalleryItem);
}

/* -------------------------------------------------------------------------- */
/* Social proof                                                               */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await db.testimonial.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toTestimonial);
}

/**
 * Returns an empty array until a client has consented to being named
 * (DesignRHF §21). Callers must render the general trust copy in that case —
 * PRD §11.9.
 */
export async function getClients(): Promise<Client[]> {
  const rows = await db.client.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toClient);
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export async function getFaqs(): Promise<Faq[]> {
  const rows = await db.faq.findMany({
    where: PUBLISHED,
    orderBy: BY_SORT_ORDER,
  });

  return rows.map(toFaq);
}
