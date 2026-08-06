/**
 * Proves the Turso schema behaves like the Postgres one it replaced.
 *
 * Three things are checked, and the third is the reason this file exists:
 * SQLite disables foreign keys by default. If Turso does not turn them on,
 * deleting a package would leave orphan rows in `menu_item_categories` and the
 * admin panel would keep showing categories for packages that no longer exist —
 * silently, with no error anywhere.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/verify-turso.mts
 *
 * Writes are made under ids prefixed `__verify`, and removed again at the end.
 */
import { createClient } from "@libsql/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "../src/generated/prisma/client.js";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const results: { label: string; ok: boolean; detail?: string }[] = [];
const check = (label: string, ok: boolean, detail = "") => {
  results.push({ label, ok, detail });
  console.log(`${ok ? "  OK  " : " GAGAL"}  ${label}${detail ? " — " + detail : ""}`);
};

// ── 1. tabel yang diharapkan ada ────────────────────────────────────────────
const raw = createClient({ url, authToken });
const tables = (
  await raw.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  )
).rows.map((r) => r.name as string);

const expected = [
  "admin_users", "clients", "faqs", "gallery_items", "login_attempts",
  "menu_categories", "menu_item_categories", "menu_items", "site_settings",
  "testimonials",
];
const missing = expected.filter((t) => !tables.includes(t));
check("sepuluh tabel aplikasi ada di Turso", missing.length === 0,
  missing.length ? `kurang: ${missing.join(", ")}` : tables.join(", "));

const pragma = await raw.execute("PRAGMA foreign_keys");
check("foreign key aktif di koneksi libSQL", Number(Object.values(pragma.rows[0] ?? {})[0]) === 1,
  JSON.stringify(pragma.rows[0] ?? {}));

// ── 2. tulis & baca lewat Prisma ────────────────────────────────────────────
const db = new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) });

await db.menuItemCategory.deleteMany({ where: { menuItemId: { startsWith: "__verify" } } });
await db.menuItem.deleteMany({ where: { id: { startsWith: "__verify" } } });
await db.menuCategory.deleteMany({ where: { id: { startsWith: "__verify" } } });

const kategori = await db.menuCategory.create({
  data: { id: "__verify-kat", name: "Uji Cascade", slug: "__verify-uji-cascade", sortOrder: 999 },
});
const paket = await db.menuItem.create({
  data: {
    id: "__verify-paket", name: "Paket Uji", slug: "__verify-paket-uji",
    description: "Dipakai hanya untuk memverifikasi cascade delete.",
    packageItems: JSON.stringify(["Item A", "Item B"]),
    galleryImages: JSON.stringify([]),
    tags: JSON.stringify(["Uji"]),
    sortOrder: 999,
    categories: { create: [{ categoryId: kategori.id }] },
  },
  include: { categories: true },
});
check("insert dengan nested join lewat Prisma", paket.categories.length === 1);

const dibaca = await db.menuItem.findUniqueOrThrow({ where: { id: paket.id } });
check("kolom JSON pulang utuh", JSON.parse(dibaca.packageItems).length === 2,
  dibaca.packageItems);
check("DateTime pulang sebagai Date", dibaca.createdAt instanceof Date,
  String(dibaca.createdAt));

// ── 3. cascade — inti dari berkas ini ───────────────────────────────────────
await db.menuItem.delete({ where: { id: paket.id } });
const yatimPaket = await db.menuItemCategory.count({ where: { menuItemId: paket.id } });
check("hapus paket ikut menghapus baris join (cascade)", yatimPaket === 0,
  `${yatimPaket} baris yatim tersisa`);

await db.menuItem.create({
  data: {
    id: "__verify-paket2", name: "Paket Uji 2", slug: "__verify-paket-uji-2",
    description: "Cascade dari sisi kategori.", sortOrder: 999,
    categories: { create: [{ categoryId: kategori.id }] },
  },
});
await db.menuCategory.delete({ where: { id: kategori.id } });
const yatimKategori = await db.menuItemCategory.count({ where: { categoryId: kategori.id } });
check("hapus kategori ikut menghapus baris join (cascade)", yatimKategori === 0,
  `${yatimKategori} baris yatim tersisa`);

// ── 4. transaksi interaktif ─────────────────────────────────────────────────
try {
  await db.$transaction(async (tx) => {
    await tx.menuItem.update({ where: { id: "__verify-paket2" }, data: { sortOrder: 1000 } });
    await tx.menuItem.findMany({ take: 1 });
  });
  const t = await db.menuItem.findUnique({ where: { id: "__verify-paket2" } });
  check("transaksi interaktif ($transaction callback) jalan", t?.sortOrder === 1000);
} catch (e) {
  check("transaksi interaktif ($transaction callback) jalan", false, String(e).slice(0, 90));
}

// ── 5. agregat, yang dipakai untuk urutan record baru ───────────────────────
const agg = await db.menuItem.aggregate({ _max: { sortOrder: true } });
check("aggregate _max jalan", typeof agg._max.sortOrder === "number", String(agg._max.sortOrder));

// ── bersihkan ───────────────────────────────────────────────────────────────
await db.menuItem.deleteMany({ where: { id: { startsWith: "__verify" } } });
await db.menuCategory.deleteMany({ where: { id: { startsWith: "__verify" } } });
const sisa = await db.menuItem.count({ where: { id: { startsWith: "__verify" } } });
check("data uji dibersihkan", sisa === 0, `${sisa} tersisa`);

await db.$disconnect();

const gagal = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - gagal.length}/${results.length} lulus ===`);
if (gagal.length) console.log("GAGAL: " + gagal.map((f) => f.label).join("; "));
process.exit(gagal.length ? 1 : 0);
