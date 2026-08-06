"use server";

import { runMutation, runSimpleMutation, type FormState } from "@/lib/admin/crud";
import { CategorySchema } from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/**
 * Category management — PRD §12.4.
 *
 * The write's result is returned rather than redirected on. The form lives in
 * a drawer over the list, so there is nowhere to send anyone: `{ ok: true }` is
 * what closes the panel and refreshes the rows underneath it.
 */

function readForm(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished"),
  };
}

export async function createCategory(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(CategorySchema, readForm(formData), async (data) => {
    await db.menuCategory.create({ data });
  });
}

export async function updateCategory(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(CategorySchema, readForm(formData), async (data) => {
    await db.menuCategory.update({ where: { id }, data });
  });
}

export async function toggleCategoryPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.menuCategory.update({ where: { id }, data: { isPublished: next } });
  });
}

/**
 * Deleting a category cascades through `menu_item_categories`, so every
 * package that used it silently loses the label. The list page shows the count
 * before the confirmation, which is where that consequence is made visible.
 */
export async function deleteCategory(id: string) {
  await runSimpleMutation(async () => {
    await db.menuCategory.delete({ where: { id } });
  });
}
