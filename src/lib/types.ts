/**
 * Domain types for RHF Catering & Snack Box.
 *
 * These mirror the data model in PRDRhf.md §17 field-for-field. Repositories
 * return these shapes, so pages are insulated from where the data actually
 * comes from — seed modules now, Prisma once the database is provisioned.
 */

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  /** Icon key resolved by `categoryIcon()`; not a component reference. */
  icon?: string;
  sortOrder: number;
  isPublished: boolean;
};

export type MenuItem = {
  id: string;
  name: string;
  slug: string;
  /**
   * Opening of `description`, cut to fit a catalogue card. Derived in
   * `toMenuItem`, not stored — see lib/menu-text.ts.
   */
  shortDescription: string;
  description: string;
  /** Numeric price, used for sorting. Absent when the price is quote-only. */
  price?: number;
  /**
   * Customer-facing price string, e.g. "Mulai Rp15.000/box" or "Hubungi
   * Admin". Derived from `price` and the unit column, not stored.
   */
  priceLabel: string;
  minOrder?: string;
  packageItems?: string[];
  imageUrl?: string;
  galleryImages?: string[];
  categoryIds: string[];
  /** Free-form labels shown as badges, e.g. "Best Seller". */
  tags?: string[];
  /** Plain-language note on which events the package suits. */
  suitableFor?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  title?: string;
  caption?: string;
  imageUrl?: string;
  /** Matches a `GALLERY_CATEGORIES` value; see PRD §11.7. */
  category?: string;
  sortOrder: number;
  isPublished: boolean;
};

export type Testimonial = {
  id: string;
  customerName: string;
  customerType?: string;
  message: string;
  rating?: number;
  imageUrl?: string;
  sortOrder: number;
  isPublished: boolean;
};

export type Client = {
  id: string;
  name: string;
  category?: string;
  logoUrl?: string;
  sortOrder: number;
  isPublished: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  /** Stored as the owner types it, e.g. "0895422734153". Normalised at link time. */
  whatsappNumber: string;
  whatsappTemplate: string;
  location: string;
  serviceArea: string;
  businessHours?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  email?: string;
  logoUrl?: string;
  seoTitle: string;
  seoDescription: string;
};

/** Gallery groupings from PRD §11.7. */
export const GALLERY_CATEGORIES = [
  "Snack Box",
  "Nasi Box",
  "Prasmanan",
  "Coffee Break",
  "Event/Dinas",
  "Dapur/Proses",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/** Catalogue sort options from PRD §11.5. */
export const SORT_OPTIONS = [
  { value: "rekomendasi", label: "Rekomendasi" },
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga Termurah" },
  { value: "termahal", label: "Harga Tertinggi" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
