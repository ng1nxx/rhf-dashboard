/**
 * Admin roles — PRD §12.1.
 *
 * Was a Prisma enum until the move to Turso; SQLite has no enum type and
 * Prisma does not emulate one, so the column is a plain string and the set of
 * legal values lives here instead. Everything that reads the column narrows it
 * through `toAdminRole`, so an unexpected value cannot leak into a session.
 */

export const ADMIN_ROLES = ["ADMIN", "EDITOR"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * Narrows a value read from the database.
 *
 * Anything unrecognised becomes EDITOR, not ADMIN. Without a database-level
 * constraint the column can hold anything — a typo in a manual `UPDATE`, a row
 * written by an older schema — and the safe reading of "I don't know what this
 * is" is the role with fewer powers, never the one with more.
 */
export function toAdminRole(value: string): AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(value)
    ? (value as AdminRole)
    : "EDITOR";
}
