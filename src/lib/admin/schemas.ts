import { z } from "zod";

import { serializeList } from "@/lib/json-list";
import { PRICE_UNITS } from "@/lib/menu-text";
import { GALLERY_CATEGORIES } from "@/lib/types";

/**
 * Validation for every admin form — PRD §21 requires schema validation on
 * input.
 *
 * These run inside server actions, which are publicly reachable endpoints. The
 * `required` attributes on the inputs are a convenience for the person typing,
 * not a control: anything that matters is enforced here.
 *
 * Optional text fields coerce "" to `undefined` rather than storing an empty
 * string, so a cleared field ends up NULL in Postgres and the domain types'
 * "absent" case stays meaningful.
 */

/**
 * An untouched optional text input arrives as "", which means "no value".
 *
 * Resolves to `null`, never `undefined`. Prisma reads `undefined` as "leave
 * this column alone", so an emptied field would silently keep its old value —
 * clearing a description in the panel would appear to work and change nothing.
 * `null` is an instruction to write NULL.
 */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

/** Checkboxes are absent from FormData when unticked. */
export const checkboxToBoolean = z
  .union([z.literal("on"), z.literal("true"), z.literal(null), z.undefined()])
  .transform((value) => value === "on" || value === "true");

const sortOrder = z.coerce
  .number({ error: "Urutan harus berupa angka." })
  .int({ error: "Urutan harus bilangan bulat." })
  .min(0, { error: "Urutan tidak boleh negatif." });

/**
 * A textarea holding one list entry per line — how the three list columns on
 * MenuItem are typed in.
 *
 * Blank lines are dropped rather than stored: they come from a trailing return
 * or a gap left while editing, and an empty string in `packageItems` renders as
 * an empty bullet on the public detail page.
 *
 * Ends as a JSON string, not an array, because that is what the column holds —
 * SQLite has no array type. Serialising here rather than at the call site means
 * a new list field cannot be added and quietly written in the wrong shape.
 */
const linesToArray = z
  .string()
  .trim()
  .transform((value) =>
    serializeList(
      value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== ""),
    ),
  );

/** Lowercase, digits, and single hyphens — what the public URLs are built from. */
const slug = z
  .string()
  .trim()
  .min(1, { error: "Slug wajib diisi." })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
  });

/** Icon keys understood by `<CategoryIcon>`; anything else renders a fallback. */
export const CATEGORY_ICON_KEYS = [
  "box",
  "utensils",
  "soup",
  "coffee",
  "briefcase",
  "school",
  "hands",
  "heart",
  "baby",
] as const;

export const FaqSchema = z.object({
  question: z.string().trim().min(1, { error: "Pertanyaan wajib diisi." }),
  answer: z.string().trim().min(1, { error: "Jawaban wajib diisi." }),
  sortOrder,
  isPublished: checkboxToBoolean,
});

export const CategorySchema = z.object({
  name: z.string().trim().min(1, { error: "Nama kategori wajib diisi." }),
  slug,
  description: optionalText,
  icon: optionalText.refine(
    (value) =>
      value === null || (CATEGORY_ICON_KEYS as readonly string[]).includes(value),
    { error: "Ikon tidak dikenal." },
  ),
  sortOrder,
  isPublished: checkboxToBoolean,
});

/**
 * Menu package — PRD §12.3.
 *
 * The one entity whose form is not flat: `categoryIds` is a many-to-many
 * written through a join table, and three columns are Postgres arrays typed in
 * as lines of text.
 */
const menuItemFields = {
  name: z.string().trim().min(1, { error: "Nama paket wajib diisi." }),
  // One description now. The catalogue card shows its opening; there is no
  // second field that can drift out of step with it.
  description: z
    .string()
    .trim()
    .min(1, { error: "Deskripsi wajib diisi." }),

  // PRD §12.3 marks this required, and it is: a package in no category is
  // unreachable from every filter on /menu, so it would be published and
  // invisible at the same time.
  categoryIds: z
    .array(z.string().trim().min(1))
    .min(1, { error: "Pilih minimal satu kategori." })
    // The join table's primary key is the pair, so a repeated id would come
    // back as a unique-constraint error — which reads as "slug already taken"
    // by the time it reaches the form.
    .transform((ids) => [...new Set(ids)]),

  // Absent price means quote-only, which the mapper renders as "Hubungi
  // Admin". Stored as a plain integer of rupiah — no separators.
  price: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine(
      (value) => value === null || (Number.isInteger(value) && value >= 0),
      { error: "Harga harus bilangan bulat rupiah, tanpa titik atau koma." },
    ),
  priceUnit: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .refine(
      (value) =>
        value === null || (PRICE_UNITS as readonly string[]).includes(value),
      { error: "Satuan harga tidak dikenal." },
    ),
  minOrder: optionalText,

  packageItems: linesToArray,
  suitableFor: optionalText,

  imageUrl: optionalText,
  galleryImages: linesToArray,

  tags: linesToArray,
  isFeatured: checkboxToBoolean,
  isPublished: checkboxToBoolean,
  sortOrder,

  seoTitle: optionalText,
  seoDescription: optionalText,
};

/** A unit without a price would render as a stray "/box" attached to nothing. */
const priceUnitRule = {
  check: (data: { price: number | null; priceUnit: string | null }) =>
    data.price === null || data.priceUnit !== null,
  message: { error: "Pilih satuan harganya.", path: ["priceUnit"] as string[] },
  normalise: <T extends { price: number | null; priceUnit: string | null }>(
    data: T,
  ) => ({ ...data, priceUnit: data.price === null ? null : data.priceUnit }),
};

/**
 * Creating accepts a slug; updating does not — and that omission is the whole
 * mechanism.
 *
 * Hiding the field in the form would stop the person changing it by accident,
 * but a server action is a public endpoint: a slug posted to the update action
 * would still be written. Leaving it out of the schema means there is nothing
 * to write, so an address that has been shared over WhatsApp cannot be moved
 * out from under the people holding the link.
 */
export const MenuItemCreateSchema = z
  .object({ ...menuItemFields, slug })
  .refine(priceUnitRule.check, priceUnitRule.message)
  .transform(priceUnitRule.normalise);

export const MenuItemUpdateSchema = z
  .object(menuItemFields)
  .refine(priceUnitRule.check, priceUnitRule.message)
  .transform(priceUnitRule.normalise);

export const GalleryItemSchema = z.object({
  title: optionalText,
  caption: optionalText,
  imageUrl: optionalText,
  category: optionalText.refine(
    (value) =>
      value === null || (GALLERY_CATEGORIES as readonly string[]).includes(value),
    { error: "Kategori galeri tidak dikenal." },
  ),
  sortOrder,
  isPublished: checkboxToBoolean,
});

export const TestimonialSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(1, { error: "Nama pelanggan wajib diisi." }),
  customerType: optionalText,
  message: z.string().trim().min(1, { error: "Isi testimoni wajib diisi." }),
  rating: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : Number(value)))
    .refine(
      (value) =>
        value === null || (Number.isInteger(value) && value >= 1 && value <= 5),
      { error: "Rating harus antara 1 sampai 5." },
    ),
  imageUrl: optionalText,
  sortOrder,
  isPublished: checkboxToBoolean,
});

export const ClientSchema = z.object({
  name: z.string().trim().min(1, { error: "Nama client wajib diisi." }),
  category: optionalText,
  logoUrl: optionalText,
  sortOrder,
  // No default of `true` anywhere: DesignRHF §21 forbids publishing a client's
  // name or logo without consent, so this has to be ticked deliberately.
  isPublished: checkboxToBoolean,
});

/** Turns a name into a URL-safe slug; the field stays editable afterwards. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
