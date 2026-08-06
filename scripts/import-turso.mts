/**
 * Restores the Supabase export into Turso.
 *
 * A restore, not a merge: every table it touches is emptied first, so running
 * it twice gives the same result as running it once. That is the behaviour you
 * want from a migration script — a half-applied import that silently skipped
 * conflicting rows is much harder to notice than one that starts clean.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/import-turso.mts
 *
 * Two shapes change on the way in, and nothing else does:
 *   - the three list columns become JSON strings, because SQLite has no arrays;
 *   - timestamps arrive from JSON as strings and go back to being Dates.
 *
 * Ids are preserved, so the Cloudinary URLs, the join rows, and the admin
 * password hash all keep pointing at the same things they did in Postgres.
 */
import { readFileSync } from "node:fs";

import { PrismaLibSql } from "@prisma/adapter-libsql";

// The generated client is real JavaScript; `json-list` is TypeScript that Node
// strips types from at load, so each is imported with the extension it has.
import { PrismaClient } from "../src/generated/prisma/client.js";
import { serializeList } from "../src/lib/json-list.ts";

type Row = Record<string, unknown>;

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum diset di .env.local.");
  process.exit(1);
}

const { tables } = JSON.parse(
  readFileSync("backup/supabase-export.json", "utf8"),
) as { tables: Record<string, Row[]> };

const db = new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) });

/** JSON has no Date type, so every timestamp arrives as a string. */
const dates = (row: Row, ...fields: string[]): Row => {
  const out = { ...row };
  for (const field of fields) {
    if (out[field]) out[field] = new Date(String(out[field]));
  }
  return out;
};

// Emptied child-first, so no delete is ever blocked by a row pointing at it.
console.log("Mengosongkan tabel…");
await db.menuItemCategory.deleteMany();
await db.menuItem.deleteMany();
await db.menuCategory.deleteMany();
await db.galleryItem.deleteMany();
await db.testimonial.deleteMany();
await db.client.deleteMany();
await db.faq.deleteMany();
await db.siteSettings.deleteMany();
await db.adminUser.deleteMany();

const written: Record<string, number> = {};
const write = async (name: string, n: number) => {
  written[name] = n;
  console.log(`  ${name.padEnd(22)} ${String(n).padStart(4)} baris`);
};

await db.adminUser.createMany({
  data: tables.admin_users.map((r) => dates(r, "createdAt", "updatedAt")) as never,
});
await write("admin_users", tables.admin_users.length);

await db.siteSettings.createMany({
  data: tables.site_settings.map((r) => dates(r, "updatedAt")) as never,
});
await write("site_settings", tables.site_settings.length);

await db.menuCategory.createMany({
  data: tables.menu_categories.map((r) =>
    dates(r, "createdAt", "updatedAt"),
  ) as never,
});
await write("menu_categories", tables.menu_categories.length);

await db.menuItem.createMany({
  data: tables.menu_items.map((row) => ({
    ...dates(row, "createdAt", "updatedAt"),
    packageItems: serializeList((row.packageItems as string[]) ?? []),
    galleryImages: serializeList((row.galleryImages as string[]) ?? []),
    tags: serializeList((row.tags as string[]) ?? []),
  })) as never,
});
await write("menu_items", tables.menu_items.length);

await db.menuItemCategory.createMany({ data: tables.menu_item_categories as never });
await write("menu_item_categories", tables.menu_item_categories.length);

await db.galleryItem.createMany({
  data: tables.gallery_items.map((r) => dates(r, "createdAt", "updatedAt")) as never,
});
await write("gallery_items", tables.gallery_items.length);

await db.testimonial.createMany({
  data: tables.testimonials.map((r) => dates(r, "createdAt", "updatedAt")) as never,
});
await write("testimonials", tables.testimonials.length);

await db.client.createMany({
  data: tables.clients.map((r) => dates(r, "createdAt", "updatedAt")) as never,
});
await write("clients", tables.clients.length);

await db.faq.createMany({
  data: tables.faqs.map((r) => dates(r, "createdAt", "updatedAt")) as never,
});
await write("faqs", tables.faqs.length);

await db.$disconnect();

const total = Object.values(written).reduce((n, k) => n + k, 0);
console.log(`\n${total} baris diimpor ke Turso.`);
