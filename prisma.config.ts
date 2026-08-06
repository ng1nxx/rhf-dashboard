import { defineConfig } from "prisma/config";

/*
  The Prisma CLI reads `.env`; Next.js keeps local secrets in `.env.local`.
  Loading it here means both read the same file — the seed script runs under
  this config and needs the Turso credentials.

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
 * The datasource here is a **local SQLite file, not Turso**, and that is
 * deliberate.
 *
 * The Prisma CLI has no way to reach Turso: `datasource` accepts only a URL,
 * and the schema engine does not understand `libsql://` or bearer tokens.
 * Driver adapters solve this for the application at runtime, but there is no
 * slot to hand one to the CLI.
 *
 * So migrations are authored against `prisma/dev.db` — a throwaway file whose
 * only job is to give `prisma migrate dev` something to diff against — and the
 * SQL it produces is applied to Turso by `scripts/turso-migrate.mts`. The file
 * is never read by the application; `src/lib/db.ts` always talks to Turso, so
 * there is still exactly one source of truth.
 *
 * Practical consequence: after `npm run db:migrate` you must also run
 * `npm run db:push-turso`, or the real database will not have the change.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "file:./prisma/dev.db",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
