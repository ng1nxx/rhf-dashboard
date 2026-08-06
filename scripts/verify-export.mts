/**
 * Checks the Supabase export before anything is built on top of it.
 *
 * The export runs once, against a database that is about to be switched off.
 * If something is missing or malformed, the time to find out is now — not
 * during the import, when the source may already be gone.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/verify-export.mts
 */
import { readFileSync } from "node:fs";

import { Pool } from "pg";

type Row = Record<string, unknown>;

const dump = JSON.parse(readFileSync("backup/supabase-export.json", "utf8")) as {
  exportedAt: string;
  tables: Record<string, Row[]>;
};

const results: { label: string; ok: boolean; detail?: string }[] = [];
const check = (label: string, ok: boolean, detail = "") => {
  results.push({ label, ok, detail });
  console.log(`${ok ? "  OK  " : " GAGAL"}  ${label}${detail ? " — " + detail : ""}`);
};

// ── 1. jumlah baris cocok dengan sumbernya ──────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? process.env.DIRECT_URL,
});

const mismatched: string[] = [];
for (const [table, rows] of Object.entries(dump.tables)) {
  const { rows: counted } = await pool.query(
    `select count(*)::int as n from "${table}"`,
  );
  if (counted[0].n !== rows.length) {
    mismatched.push(`${table}: db ${counted[0].n} vs ekspor ${rows.length}`);
  }
}
await pool.end();
check("jumlah baris tiap tabel sama dengan database", mismatched.length === 0,
  mismatched.join("; ") || `${Object.keys(dump.tables).length} tabel diperiksa`);

// ── 2. kolom array terbawa sebagai array, bukan string ──────────────────────
const menu = dump.tables.menu_items;
const arrayFields = ["packageItems", "galleryImages", "tags"] as const;
const bukanArray = menu.filter((m) =>
  arrayFields.some((f) => !Array.isArray(m[f])),
);
check("tiga kolom array terbawa sebagai array JSON", bukanArray.length === 0,
  bukanArray.length ? `${bukanArray.length} baris salah bentuk` :
    `contoh: ${JSON.stringify((menu[0] as Row).packageItems).slice(0, 60)}`);

const totalElemen = menu.reduce(
  (n, m) => n + arrayFields.reduce((k, f) => k + (m[f] as unknown[]).length, 0),
  0,
);
check("isi array tidak kosong", totalElemen > 0, `${totalElemen} elemen`);

// ── 3. yang hanya ada di sini, bukan di seed ────────────────────────────────
const kemerdekaan = menu.find((m) =>
  String(m.name).toLowerCase().includes("kemerdekaan"),
);
check("paket buatan pemilik ikut terbawa", Boolean(kemerdekaan),
  kemerdekaan ? String(kemerdekaan.name) : "tidak ditemukan");

const cloudinary = [
  ...menu.map((m) => m.imageUrl),
  ...menu.flatMap((m) => m.galleryImages as string[]),
  ...dump.tables.gallery_items.map((g) => g.imageUrl),
  ...dump.tables.testimonials.map((t) => t.imageUrl),
].filter((u) => typeof u === "string" && u.includes("res.cloudinary.com"));
check("tautan foto Cloudinary ikut terbawa", cloudinary.length > 0,
  `${cloudinary.length} tautan`);

// ── 4. akun admin utuh, supaya password tidak perlu di-set ulang ────────────
const admin = dump.tables.admin_users[0];
check("akun admin beserta password hash-nya ada",
  Boolean(admin?.email) && String(admin?.passwordHash ?? "").startsWith("$2"),
  `${admin?.email} · role ${admin?.role} · hash ${String(admin?.passwordHash ?? "").slice(0, 4)}…`);

// ── 5. integritas join: tiap baris menunjuk record yang ada ─────────────────
const idPaket = new Set(menu.map((m) => m.id));
const idKategori = new Set(dump.tables.menu_categories.map((c) => c.id));
const yatim = dump.tables.menu_item_categories.filter(
  (j) => !idPaket.has(j.menuItemId) || !idKategori.has(j.categoryId),
);
check("semua baris join menunjuk paket & kategori yang ada", yatim.length === 0,
  `${dump.tables.menu_item_categories.length} baris join, ${yatim.length} yatim`);

// ── 6. tanggal terbawa dalam bentuk yang bisa diurai ────────────────────────
const tanggalRusak = menu.filter((m) => Number.isNaN(Date.parse(String(m.createdAt))));
check("createdAt terbawa dalam bentuk yang bisa diurai", tanggalRusak.length === 0,
  String(menu[0]?.createdAt));

// ── 7. site settings — satu baris, id "default" ─────────────────────────────
const settings = dump.tables.site_settings[0];
check("site settings ada dan id-nya \"default\"", settings?.id === "default",
  `id=${settings?.id} · ${settings?.brandName}`);

const gagal = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - gagal.length}/${results.length} lulus ===`);
if (gagal.length) console.log("GAGAL: " + gagal.map((f) => f.label).join("; "));
process.exit(gagal.length ? 1 : 0);
