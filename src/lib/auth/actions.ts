"use server";

/**
 * Login and logout — PRD §12.1.
 *
 * Server actions are publicly reachable endpoints, so everything that matters
 * is enforced here rather than in the form component: validation, the rate
 * limit, and the password check.
 */
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { toAdminRole } from "@/lib/admin-role";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  burnTimingBudget,
  verifyPassword,
} from "@/lib/auth/password";
import {
  checkLoginRateLimit,
  clearLoginAttempts,
  recordFailedLogin,
} from "@/lib/auth/rate-limit";
import { db } from "@/lib/db";

const LoginSchema = z.object({
  email: z.email({ error: "Masukkan alamat email yang valid." }).trim(),
  password: z.string().min(1, { error: "Password wajib diisi." }),
});

export type LoginState = { error?: string } | undefined;

/**
 * One message for every failure mode — unknown email, wrong password, or a
 * disabled account.
 *
 * Distinguishing them would let anyone test which addresses have accounts, and
 * the owner already knows their own email, so the precision buys nothing.
 */
const GENERIC_FAILURE = "Email atau password salah.";

/** Only same-origin paths under /admin, so `?next=` cannot bounce off-site. */
function safeRedirectPath(candidate: string | null): string {
  if (!candidate) return "/admin";
  if (!candidate.startsWith("/admin")) return "/admin";
  // "//evil.com" and "/\evil.com" are parsed as protocol-relative URLs by
  // browsers, so they must not survive the prefix check above.
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return "/admin";

  return candidate;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_FAILURE };
  }

  const { email, password } = parsed.data;

  const limit = await checkLoginRateLimit(email);

  if (!limit.allowed) {
    return {
      error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${limit.retryAfterMinutes} menit.`,
    };
  }

  // Behind a proxy the socket address is the proxy's, so the forwarded header
  // is the only view of the caller. It is spoofable and therefore recorded for
  // diagnostics only — the rate limit counts by email, which is not.
  const forwardedFor = (await headers()).get("x-forwarded-for") ?? undefined;
  const ipAddress = forwardedFor?.split(",")[0]?.trim();

  const user = await db.adminUser.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, role: true, passwordHash: true },
  });

  if (!user) {
    // Keeps the response time in line with a real password check so the delay
    // does not reveal whether the email exists.
    await burnTimingBudget();
    await recordFailedLogin(email, ipAddress);

    return { error: GENERIC_FAILURE };
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    await recordFailedLogin(email, ipAddress);

    return { error: GENERIC_FAILURE };
  }

  await clearLoginAttempts(email);
  await createSession({ userId: user.id, role: toAdminRole(user.role) });

  redirect(safeRedirectPath(formData.get("next")?.toString() ?? null));
}

export async function logout(): Promise<void> {
  await destroySession();

  redirect("/admin/login");
}
