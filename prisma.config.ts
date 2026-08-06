import { defineConfig, env } from "prisma/config";

/**
 * Prisma CLI configuration.
 *
 * As of Prisma 7 the datasource URL is no longer allowed in `schema.prisma`;
 * migrate and introspect read it from here, and the runtime client is
 * constructed with a driver adapter instead.
 *
 * Migrations use DIRECT_URL, not DATABASE_URL. Supabase's DATABASE_URL points
 * at pgBouncer in transaction mode (port 6543), which cannot hold the session
 * state or advisory locks that `prisma migrate` needs. DIRECT_URL is the
 * non-pooled connection to the same database.
 *
 * The application runtime is the other way around: it goes through the pooler,
 * because serverless functions open far more connections than Postgres will
 * accept directly. See `src/lib/db.ts`.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
