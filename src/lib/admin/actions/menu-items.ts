"use server";

import {
  runMutation,
  runSimpleMutation,
  type FormState,
} from "@/lib/admin/crud";
import {
  MenuItemCreateSchema,
  MenuItemUpdateSchema,
  slugify,
} from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/** Menu package management — PRD §12.3. */

function readForm(formData: FormData) {
  return {
    name: formData.get("name"),
    description: formData.get("description"),
    // Checkboxes sharing one name submit one entry each, so `get` would keep
    // the first and quietly drop the rest.
    categoryIds: formData.getAll("categoryIds"),
    price: formData.get("price"),
    priceUnit: formData.get("priceUnit"),
    minOrder: formData.get("minOrder"),
    packageItems: formData.get("packageItems"),
    suitableFor: formData.get("suitableFor"),
    imageUrl: formData.get("imageUrl"),
    galleryImages: formData.get("galleryImages"),
    tags: formData.get("tags"),
    isFeatured: formData.get("isFeatured"),
    isPublished: formData.get("isPublished"),
    sortOrder: formData.get("sortOrder"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  };
}

/**
 * A slug derived from the name, with a number appended if that address is
 * taken.
 *
 * The slug field is not in the form any more, so a collision has no field the
 * person could go and fix — "that slug is in use" would be a dead end on a
 * screen with no slug on it. Disambiguating here means two packages called
 * "Paket Ramadan" both save, as `paket-ramadan` and `paket-ramadan-2`.
 */
async function availableSlug(name: string): Promise<string> {
  const base = slugify(name) || "paket";

  const taken = new Set(
    (
      await db.menuItem.findMany({
        where: { slug: { startsWith: base } },
        select: { slug: true },
      })
    ).map((row) => row.slug),
  );

  if (!taken.has(base)) return base;

  for (let suffix = 2; ; suffix++) {
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
}

export async function createMenuItem(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = readForm(formData);

  return runMutation(
    MenuItemCreateSchema,
    { ...raw, slug: await availableSlug(String(raw.name ?? "")) },
    async ({ categoryIds, ...fields }) => {
      await db.menuItem.create({
        data: {
          ...fields,
          categories: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });
    },
  );
}

export async function updateMenuItem(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(
    MenuItemUpdateSchema,
    readForm(formData),
    async ({ categoryIds, ...fields }) => {
      /*
        The join rows are reconciled by difference rather than wiped and
        rebuilt.

        A nested `categories: { deleteMany: {}, create: [...] }` inside the
        update would be shorter, but Prisma does not document the order it
        applies nested operations in — and if `create` ran before `deleteMany`,
        every edit would silently clear the package's categories. Spelling the
        three statements out removes the guess, and it leaves rows that did not
        change untouched.
      */
      await db.$transaction(async (tx) => {
        await tx.menuItem.update({ where: { id }, data: fields });

        await tx.menuItemCategory.deleteMany({
          where: { menuItemId: id, categoryId: { notIn: categoryIds } },
        });

        await tx.menuItemCategory.createMany({
          data: categoryIds.map((categoryId) => ({ menuItemId: id, categoryId })),
          skipDuplicates: true,
        });
      });
    },
  );
}

export async function toggleMenuItemPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.menuItem.update({ where: { id }, data: { isPublished: next } });
  });
}

/**
 * Deleting a package also drops its join rows — `onDelete: Cascade` sits on the
 * MenuItem side of `menu_item_categories`, so nothing has to be cleaned up
 * here. The categories themselves are untouched.
 */
export async function deleteMenuItem(id: string) {
  await runSimpleMutation(async () => {
    await db.menuItem.delete({ where: { id } });
  });
}
