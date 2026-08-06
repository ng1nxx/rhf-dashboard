/**
 * One-off export of the Supabase database, ahead of the move to Turso.
 *
 * Reads every table through a plain `pg` connection rather than through Prisma:
 * by the time this runs, `schema.prisma` has already been switched to SQLite,
 * so the generated client no longer matches the database it is reading from.
 * Raw SQL sidesteps that entirely and keeps this script working no matter what
 * state the schema is in.
 *
 * Rows are written exactly as Postgres returns them — same ids, same
 * timestamps. `scripts/import-turso.mts` is what reshapes them for SQLite.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/export-supabase.mts
 *
 * Needs DATABASE_URL (or DIRECT_URL) to still be present in `.env.local`.
 */
import { writeFileSync, mkdirSync } from "node:fs";

import { Pool } from "pg";

/** Ordered so the import can replay them without tripping a foreign key. */
const TABLES = [
  "admin_users",
  "site_settings",
  "menu_categories",
  "menu_items",
  "menu_item_categories",
  "gallery_items",
  "testimonials",
  "clients",
  "faqs",
] as const;

// `login_attempts` is deliberately absent: it is a rate-limiting ledger whose
// rows expire on their own, and carrying it over would import stale lockouts.

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!connectionString) {
  console.error(
    "DATABASE_URL / DIRECT_URL tidak ada di .env.local.\n" +
      "Tempel kembali connection string Supabase sebentar untuk menjalankan ekspor ini.",
  );
  process.exit(1);
}

const pool = new Pool({ connectionString });
const dump: Record<string, unknown[]> = {};

try {
  for (const table of TABLES) {
    const { rows } = await pool.query(`select * from "${table}"`);
    dump[table] = rows;
    console.log(`  ${table.padEnd(22)} ${String(rows.length).padStart(4)} baris`);
  }
} finally {
  await pool.end();
}

mkdirSync("backup", { recursive: true });

const path = `backup/supabase-export.json`;
writeFileSync(path, JSON.stringify({ exportedAt: new Date().toISOString(), tables: dump }, null, 2));

const total = Object.values(dump).reduce((n, rows) => n + rows.length, 0);
console.log(`\n${total} baris ditulis ke ${path}`);
