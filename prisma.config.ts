import { defineConfig } from "prisma/config";

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

/*
  Read directly rather than through Prisma's `env()` helper, and attach the
  datasource only when the variable is actually there.

  `env()` throws while the config file is being loaded, which happens before
  Prisma knows which command it is about to run. That turns a missing
  DIRECT_URL into a failure of EVERY Prisma command — including `generate`,
  which only reads the schema and never opens a connection. On Vercel that
  surfaced as `npm install` dying in the postinstall hook.

  Commands that genuinely need a connection (`migrate`, `db seed`, `studio`)
  still fail without it, which is correct — but they fail on their own terms,
  with a message about the connection rather than about config parsing.
*/
const directUrl = process.env.DIRECT_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(directUrl ? { datasource: { url: directUrl } } : {}),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
