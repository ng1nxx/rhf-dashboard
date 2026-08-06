import { defineConfig, env } from "prisma/config";

/*
  The Prisma CLI reads `.env`; Next.js keeps local secrets in `.env.local`.
  Loading it here means both read the same file — without this, every CLI
  command fails with "Cannot resolve environment variable: DIRECT_URL" unless
  the variable happens to already be exported in the shell.

  On Vercel there is no such file and the variables are already in the
  environment, which is what the empty catch is for.
*/
try {
  process.loadEnvFile(".env.local");
} catch {
  // No local env file — nothing to load.
}

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
