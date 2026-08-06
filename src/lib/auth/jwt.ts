/**
 * Session token signing and verification.
 *
 * Deliberately free of `next/headers`, Prisma, and `server-only`: this module
 * is imported by `src/proxy.ts`, which the Next.js docs say should not depend
 * on the app's shared modules or globals. Keeping it to nothing but `jose` and
 * `process.env` is what makes it safe to use from both sides.
 *
 * Cookie handling lives in `session.ts`; database lookups live in `dal.ts`.
 */
import { jwtVerify, SignJWT } from "jose";

/** Kept deliberately small — this travels in a cookie on every request. */
export type SessionPayload = {
  userId: string;
  role: "ADMIN" | "EDITOR";
};

export const SESSION_COOKIE = "rhf_admin_session";

/** Seven days: long enough that the owner is not re-typing a password weekly. */
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function encodedKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET belum diset. Jalankan `openssl rand -base64 32` dan isi di .env.local.",
    );
  }

  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(encodedKey());
}

/**
 * Returns the payload, or `null` for anything unusable — expired, tampered
 * with, signed by a different secret, or simply absent.
 *
 * Never throws on a bad token: a visitor arriving with a stale cookie is an
 * ordinary situation that should end in a redirect to the login page, not a
 * 500.
 */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey(), {
      algorithms: ["HS256"],
    });

    const { userId, role } = payload as Partial<SessionPayload>;

    if (typeof userId !== "string") return null;
    if (role !== "ADMIN" && role !== "EDITOR") return null;

    return { userId, role };
  } catch {
    return null;
  }
}
