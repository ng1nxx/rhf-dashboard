/**
 * Login rate limiting — PRD §21.
 *
 * Counts recent failures per email in the database. An in-memory counter would
 * be worthless on Vercel: every serverless instance keeps its own memory, so an
 * attacker spreading attempts across cold starts would never hit a limit.
 *
 * Only failures are stored, and a successful login clears them, so the table
 * stays small and a legitimate owner who mistypes twice starts clean again
 * after getting in.
 */
import "server-only";

import { db } from "@/lib/db";

/** Attempts allowed inside the window before the account is held. */
const MAX_ATTEMPTS = 5;

/** How far back failures are counted, and how long a lockout therefore lasts. */
const WINDOW_MINUTES = 15;

function windowStart(): Date {
  return new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
}

/** Emails are matched case-insensitively so casing cannot dodge the counter. */
function normalise(email: string): string {
  return email.trim().toLowerCase();
}

export type RateLimitVerdict =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterMinutes: number };

export async function checkLoginRateLimit(
  email: string,
): Promise<RateLimitVerdict> {
  const since = windowStart();

  const recent = await db.loginAttempt.findMany({
    where: { email: normalise(email), createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  if (recent.length < MAX_ATTEMPTS) {
    return { allowed: true, remaining: MAX_ATTEMPTS - recent.length };
  }

  // The hold ends a full window after the oldest failure still being counted,
  // so the lockout decays on its own rather than needing a cleanup job.
  const oldest = recent[0].createdAt.getTime();
  const unlocksAt = oldest + WINDOW_MINUTES * 60 * 1000;
  const retryAfterMinutes = Math.max(
    1,
    Math.ceil((unlocksAt - Date.now()) / 60000),
  );

  return { allowed: false, retryAfterMinutes };
}

export async function recordFailedLogin(
  email: string,
  ipAddress?: string,
): Promise<void> {
  await db.loginAttempt.create({
    data: { email: normalise(email), ipAddress: ipAddress ?? null },
  });
}

export async function clearLoginAttempts(email: string): Promise<void> {
  await db.loginAttempt.deleteMany({ where: { email: normalise(email) } });
}
