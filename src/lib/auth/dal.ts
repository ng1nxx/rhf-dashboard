/**
 * Data access layer for authorization — PRD §12.1, §21.
 *
 * This is the authoritative check. `src/proxy.ts` only reads the cookie and
 * redirects, which is an optimistic filter, not a defence: server actions are
 * publicly reachable endpoints, so every one of them must call in here before
 * touching data.
 *
 * The session cookie carries a role, but this module still loads the account
 * from the database on every request. A cookie stays valid for seven days, so
 * trusting its role claim would mean a demoted or deleted admin kept their
 * access until the token expired. `cache()` collapses the repeat lookups within
 * a single render to one query.
 */
import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { readSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export type AdminSession = {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

/**
 * The signed-in account, or `null`. Never redirects — for callers that need to
 * branch on the answer, such as the login page bouncing an already-signed-in
 * visitor.
 */
export const getSession = cache(async (): Promise<AdminSession | null> => {
  const payload = await readSession();

  if (!payload) return null;

  const user = await db.adminUser.findUnique({
    where: { id: payload.userId },
    // Explicitly selected so `passwordHash` cannot ride along into a component.
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) return null;

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
});

/** The session, or a redirect to the login page. Use this in every admin page. */
export async function verifySession(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

/**
 * As `verifySession`, but rejects EDITOR.
 *
 * Guards Site Settings (PRD §12.9): an editor may change content, but the
 * WhatsApp number is the business's entire order pipeline, so changing it is
 * reserved for ADMIN.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await verifySession();

  if (session.role !== "ADMIN") {
    redirect("/admin?error=forbidden");
  }

  return session;
}
