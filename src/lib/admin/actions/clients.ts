"use server";

import { runMutation, runSimpleMutation, type FormState } from "@/lib/admin/crud";
import { ClientSchema } from "@/lib/admin/schemas";
import { db } from "@/lib/db";

/**
 * Client management — PRD §12.7.
 *
 * Nothing here defaults `isPublished` to true. DesignRHF §21 forbids showing a
 * client's name or logo without their consent, so publishing has to be a
 * deliberate switch in the form rather than something that happens by omission.
 *
 * The write's result is returned rather than redirected on: the form is in a
 * drawer over the list, and `{ ok: true }` is what closes it.
 */

function readForm(formData: FormData) {
  return {
    name: formData.get("name"),
    category: formData.get("category"),
    logoUrl: formData.get("logoUrl"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished"),
  };
}

export async function createClient(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(ClientSchema, readForm(formData), async (data) => {
    await db.client.create({ data });
  });
}

export async function updateClient(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  return runMutation(ClientSchema, readForm(formData), async (data) => {
    await db.client.update({ where: { id }, data });
  });
}

export async function toggleClientPublished(id: string, next: boolean) {
  await runSimpleMutation(async () => {
    await db.client.update({ where: { id }, data: { isPublished: next } });
  });
}

export async function deleteClient(id: string) {
  await runSimpleMutation(async () => {
    await db.client.delete({ where: { id } });
  });
}
