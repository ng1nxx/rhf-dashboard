"use server";

import { runMutation, runSimpleMutation, type FormState } from "@/lib/admin/crud";
import { FaqSchema } from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/**
 * FAQ management — PRD §12.8.
 *
 * The authorization check, validation, and public-site rebuild all happen
 * inside `runMutation`; nothing here is allowed to skip them. Its result is
 * returned to the form, which lives in a drawer and closes on `{ ok: true }`.
 */

function readForm(formData: FormData) {
  return {
    question: formData.get("question"),
    answer: formData.get("answer"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished"),
  };
}

export async function createFaq(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(FaqSchema, readForm(formData), async (data) => {
    await db.faq.create({ data });
  });
}

export async function updateFaq(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(FaqSchema, readForm(formData), async (data) => {
    await db.faq.update({ where: { id }, data });
  });
}

export async function toggleFaqPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.faq.update({ where: { id }, data: { isPublished: next } });
  });
}

export async function deleteFaq(id: string) {
  await runSimpleMutation(async () => {
    await db.faq.delete({ where: { id } });
  });
}
