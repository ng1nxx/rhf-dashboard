/**
 * Prisma client singleton, pointed at Turso.
 *
 * Prisma 7 no longer accepts a connection string on the client directly — the
 * Rust engine is gone and the query compiler needs a driver adapter, so the
 * libSQL client is handed over explicitly via `PrismaLibSql`.
 *
 * Turso is libSQL, which is SQLite. Two consequences worth knowing about:
 * there is no connection pool to exhaust (every query is an HTTP request), and
 * writes are serialised — fine for a panel one person edits at a time.
 *
 * The instance is still cached on `globalThis` because `next dev` re-evaluates
 * modules on every hot reload, and a fresh client per reload means a fresh
 * client per hot key press.
 *
 * The Prisma CLI cannot reach this database; see `prisma.config.ts`.
 */
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    // Failing loudly here beats a confusing driver error six frames deep, and
    // it is the exact symptom of a Vercel build with no env var configured.
    throw new Error(
      "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum diset. Salin .env.example ke .env.local dan isi kredensial dari dashboard Turso.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaLibSql({ url, authToken }),
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
