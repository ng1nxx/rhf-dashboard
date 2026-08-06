"use server";

import { runMutation, runSimpleMutation, type FormState } from "@/lib/admin/crud";
import { GalleryItemSchema } from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/**
 * Gallery management — PRD §12.5.
 *
 * Returns the write's result instead of redirecting: the form is in a drawer
 * over the list, and `{ ok: true }` is what closes it.
 */

function readForm(formData: FormData) {
  return {
    title: formData.get("title"),
    caption: formData.get("caption"),
    imageUrl: formData.get("imageUrl"),
    category: formData.get("category"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished"),
  };
}

export async function createGalleryItem(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(GalleryItemSchema, readForm(formData), async (data) => {
    await db.galleryItem.create({ data });
  });
}

export async function updateGalleryItem(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(GalleryItemSchema, readForm(formData), async (data) => {
    await db.galleryItem.update({ where: { id }, data });
  });
}

export async function toggleGalleryItemPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.galleryItem.update({ where: { id }, data: { isPublished: next } });
  });
}

export async function deleteGalleryItem(id: string) {
  await runSimpleMutation(async () => {
    await db.galleryItem.delete({ where: { id } });
  });
}
