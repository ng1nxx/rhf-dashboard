/**
 * Session cookie lifecycle.
 *
 * The token itself is signed and read in `jwt.ts`; this module is the only
 * place that touches `next/headers`, so `proxy.ts` can verify a token without
 * pulling the cookie store in with it.
 */
import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth/jwt";

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    // Blocks document.cookie, so an XSS bug cannot read the session out.
    httpOnly: true,
    // Off over plain http so login still works on localhost during development.
    secure: process.env.NODE_ENV === "production",
    // "lax" still sends the cookie on top-level navigation into /admin, but not
    // on cross-site POSTs — which is the CSRF shape that matters for the server
    // actions behind the admin panel.
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();

  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);
}
