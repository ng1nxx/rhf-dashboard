/**
 * Applies pending Prisma migrations to Turso.
 *
 * The Prisma CLI cannot do this itself — it has no way to authenticate against
 * `libsql://` (see prisma.config.ts) — so migrations are authored against a
 * local SQLite file and this script replays the SQL they produced.
 *
 *   npm run db:push-turso
 *
 * Which migrations have already run is recorded in `_turso_migrations`, so the
 * script is safe to run repeatedly: it applies only what is missing, in
 * filename order, and stops at the first failure rather than carrying on and
 * leaving the database half-migrated.
 *
 * Statements are sent through the libSQL client rather than raw HTTP so that
 * `PRAGMA foreign_keys` and multi-statement scripts behave the way they would
 * in a real SQLite session.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@libsql/client";

const MIGRATIONS_DIR = "prisma/migrations";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error(
    "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum diset di .env.local.",
  );
  process.exit(1);
}

const db = createClient({ url, authToken });

/**
 * Splits a migration file into statements.
 *
 * Prisma's SQLite output is one statement per `;` at end of line, with `--`
 * comments in between. That is simple enough to split on directly; there are
 * no triggers or `BEGIN...END` blocks in this schema, which is what would make
 * naive splitting wrong.
 */
function statements(sql: string): string[] {
  return sql
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

await db.execute(`
  CREATE TABLE IF NOT EXISTS _turso_migrations (
    name       TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL
  )
`);

const applied = new Set(
  (await db.execute("SELECT name FROM _turso_migrations")).rows.map(
    (row) => row.name as string,
  ),
);

const pending = readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .filter((name) => !applied.has(name));

if (pending.length === 0) {
  console.log(`Turso sudah mutakhir — ${applied.size} migrasi terpasang.`);
  process.exit(0);
}

for (const name of pending) {
  const sql = readFileSync(join(MIGRATIONS_DIR, name, "migration.sql"), "utf8");
  const parts = statements(sql);

  process.stdout.write(`  ${name} — ${parts.length} statement… `);

  // `batch` in "write" mode runs the whole migration in one transaction, so a
  // statement that fails halfway leaves the database untouched rather than
  // partially migrated with no record of it.
  await db.batch(
    [
      ...parts,
      {
        sql: "INSERT INTO _turso_migrations (name, applied_at) VALUES (?, ?)",
        args: [name, new Date().toISOString()],
      },
    ],
    "write",
  );

  console.log("selesai");
}

console.log(`\n${pending.length} migrasi diterapkan ke Turso.`);
