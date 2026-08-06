"use server";

import { runMutation, runSimpleMutation, type FormState } from "@/lib/admin/crud";
import { TestimonialSchema } from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/**
 * Testimonial management — PRD §12.6.
 *
 * Returns the write's result instead of redirecting: the form is in a drawer
 * over the list, and `{ ok: true }` is what closes it.
 */

function readForm(formData: FormData) {
  return {
    customerName: formData.get("customerName"),
    customerType: formData.get("customerType"),
    message: formData.get("message"),
    rating: formData.get("rating"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished"),
  };
}

export async function createTestimonial(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(TestimonialSchema, readForm(formData), async (data) => {
    await db.testimonial.create({ data });
  });
}

export async function updateTestimonial(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(TestimonialSchema, readForm(formData), async (data) => {
    await db.testimonial.update({ where: { id }, data });
  });
}

export async function toggleTestimonialPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.testimonial.update({ where: { id }, data: { isPublished: next } });
  });
}

export async function deleteTestimonial(id: string) {
  await runSimpleMutation(async () => {
    await db.testimonial.delete({ where: { id } });
  });
}
