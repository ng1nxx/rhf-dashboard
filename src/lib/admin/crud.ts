import "server-only";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { verifySession } from "@/lib/auth/dal";

/**
 * Shared machinery for the admin CRUD actions.
 *
 * Every entity's create/update/delete goes through `runMutation`, so the three
 * things that must never be forgotten happen in one place: the authorization
 * check, validation, and revalidating the public pages.
 */

/**
 * The outcome of one submission.
 *
 * Success is stated rather than implied by absence. The five stage-4a forms
 * redirect away and never need to know, but the menu form now lives in a
 * drawer: nothing navigates, so the only way it can close itself and refresh
 * the list behind it is to be told the write went through.
 */
export type FormResult = {
  /** True only after the mutation committed. */
  ok?: boolean;
  /** Shown above the submit button. */
  error?: string;
  /** Keyed by field name, shown under the field. */
  fieldErrors?: Record<string, string>;
};

/** What `useActionState` holds — `undefined` before the first submission. */
export type FormState = FormResult | undefined;

/**
 * Rebuilds the public site after a change.
 *
 * Deliberately the blunt version. Working out exactly which pages a given FAQ
 * or category touches means encoding, in a second place, knowledge that
 * already lives in the page components — and getting it subtly wrong shows up
 * as a customer seeing last week's price. The site is 25 pages and edits are
 * occasional, so correctness wins over precision here.
 */
export function revalidatePublicSite(): void {
  revalidatePath("/", "layout");
}

/**
 * Wraps a mutation with the auth check and validation.
 *
 * Server actions are public endpoints, so `verifySession()` runs here rather
 * than being left to each caller — an action that forgot it would be an
 * unauthenticated write.
 */
export async function runMutation<Schema extends z.ZodType>(
  schema: Schema,
  raw: unknown,
  mutate: (data: z.infer<Schema>) => Promise<void>,
): Promise<FormResult> {
  await verifySession();

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      // First message per field: showing three complaints about one input at
      // once is noise, and the person fixes them one at a time anyway.
      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return { fieldErrors, error: "Periksa kembali isian yang ditandai." };
  }

  try {
    await mutate(parsed.data);
  } catch (cause) {
    // A unique-constraint violation is the one failure the person can act on,
    // so it gets its own message instead of the generic one.
    if (isPrismaError(cause, "P2002")) {
      return { error: "Slug itu sudah dipakai. Gunakan slug lain." };
    }

    // Reachable from the menu form: a category deleted in another tab while
    // this form sat open leaves an id in the submission that no longer exists.
    // "Coba lagi" would be wrong advice — the page has to be reloaded first.
    if (isPrismaError(cause, "P2003")) {
      return {
        error:
          "Kategori yang dipilih sudah tidak ada. Muat ulang halaman, lalu pilih lagi.",
      };
    }

    console.error("Admin mutation failed:", cause);

    return { error: "Gagal menyimpan. Coba lagi." };
  }

  revalidatePublicSite();

  return { ok: true };
}

/** P2002 = unique constraint failed, P2003 = foreign key constraint failed. */
function isPrismaError(cause: unknown, code: string): boolean {
  return (
    typeof cause === "object" &&
    cause !== null &&
    "code" in cause &&
    (cause as { code?: string }).code === code
  );
}

/**
 * Guard for actions that take no form input — the publish toggle and delete.
 *
 * They still mutate, so they still need the session check and the rebuild.
 */
export async function runSimpleMutation(
  mutate: () => Promise<void>,
): Promise<void> {
  await verifySession();
  await mutate();
  revalidatePublicSite();
}
