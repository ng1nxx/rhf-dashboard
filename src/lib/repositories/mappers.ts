/**
 * Prisma row → domain type.
 *
 * The domain types in `lib/types.ts` were written before the database existed
 * and are what every page and component already consumes. Prisma's generated
 * rows differ in three ways, so the translation is centralised here rather than
 * leaking into repository functions one `?? undefined` at a time:
 *
 *   1. Optional columns come back as `null`; the domain types use optional
 *      properties, so a `null` would type-error and render as the string
 *      "null" in a template.
 *   2. `createdAt` is a `Date`; `MenuItem.createdAt` is an ISO string, because
 *      it crosses the server/client boundary into the catalogue sort.
 *   3. Category membership lives in a join table, not an array column.
 *   4. The three list columns hold JSON, because SQLite has no array type —
 *      see `lib/json-list.ts`.
 *
 * Keeping this file the only place that knows about both shapes is what lets
 * `repositories/index.ts` keep the signatures it had in round 1.
 */
import type {
  Client as PrismaClientRow,
  Faq as PrismaFaq,
  GalleryItem as PrismaGalleryItem,
  MenuCategory as PrismaMenuCategory,
  MenuItem as PrismaMenuItem,
  MenuItemCategory as PrismaMenuItemCategory,
  SiteSettings as PrismaSiteSettings,
  Testimonial as PrismaTestimonial,
} from "@/generated/prisma/client";
import { parseList } from "@/lib/json-list";
import { excerpt, priceLabel } from "@/lib/menu-text";
import type {
  Client,
  Faq,
  GalleryItem,
  MenuCategory,
  MenuItem,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

/** Prisma's `null` for "no value" vs. the domain types' absent property. */
function opt<T>(value: T | null): T | undefined {
  return value ?? undefined;
}

export function toMenuCategory(row: PrismaMenuCategory): MenuCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: opt(row.description),
    icon: opt(row.icon),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

/** A menu row with its join-table entries loaded. */
export type MenuItemRow = PrismaMenuItem & {
  categories: Pick<PrismaMenuItemCategory, "categoryId">[];
};

export function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    // Both derived rather than stored — see lib/menu-text.ts for why.
    shortDescription: excerpt(row.description),
    description: row.description,
    price: opt(row.price),
    priceLabel: priceLabel(row.price, row.priceUnit),
    minOrder: opt(row.minOrder),
    packageItems: parseList(row.packageItems),
    imageUrl: opt(row.imageUrl),
    galleryImages: parseList(row.galleryImages),
    categoryIds: row.categories.map((link) => link.categoryId),
    tags: parseList(row.tags),
    suitableFor: opt(row.suitableFor),
    isFeatured: row.isFeatured,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    seoTitle: opt(row.seoTitle),
    seoDescription: opt(row.seoDescription),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toGalleryItem(row: PrismaGalleryItem): GalleryItem {
  return {
    id: row.id,
    title: opt(row.title),
    caption: opt(row.caption),
    imageUrl: opt(row.imageUrl),
    category: opt(row.category),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

export function toTestimonial(row: PrismaTestimonial): Testimonial {
  return {
    id: row.id,
    customerName: row.customerName,
    customerType: opt(row.customerType),
    message: row.message,
    rating: opt(row.rating),
    imageUrl: opt(row.imageUrl),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

export function toClient(row: PrismaClientRow): Client {
  return {
    id: row.id,
    name: row.name,
    category: opt(row.category),
    logoUrl: opt(row.logoUrl),
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

export function toFaq(row: PrismaFaq): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  };
}

/**
 * `id` and `updatedAt` are deliberately dropped: the settings row is a
 * singleton pinned to id "default", so neither field means anything to a page.
 */
export function toSiteSettings(row: PrismaSiteSettings): SiteSettings {
  return {
    brandName: row.brandName,
    tagline: row.tagline,
    whatsappNumber: row.whatsappNumber,
    whatsappTemplate: row.whatsappTemplate,
    location: row.location,
    serviceArea: row.serviceArea,
    businessHours: opt(row.businessHours),
    instagramUrl: opt(row.instagramUrl),
    tiktokUrl: opt(row.tiktokUrl),
    facebookUrl: opt(row.facebookUrl),
    email: opt(row.email),
    logoUrl: opt(row.logoUrl),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}
