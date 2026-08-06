/**
 * Prisma client singleton.
 *
 * Prisma 7 no longer accepts a connection string on the client directly — the
 * Rust engine is gone and the query compiler needs a driver adapter, so the
 * `pg` pool is handed over explicitly via `PrismaPg`.
 *
 * The instance is cached on `globalThis` because `next dev` re-evaluates
 * modules on every hot reload; without the cache each reload would open a new
 * pool and Supabase would run out of connections within a few edits.
 *
 * `DATABASE_URL` points at Supabase's pgBouncer pooler (port 6543) and must
 * carry `?pgbouncer=true`. Migrations use `DIRECT_URL` instead — see
 * `prisma.config.ts`.
 */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // Failing loudly here beats a confusing driver error six frames deep, and
    // it is the exact symptom of a Vercel build with no env var configured.
    throw new Error(
      "DATABASE_URL belum diset. Salin .env.example ke .env.local dan isi connection string dari Supabase.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
