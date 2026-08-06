/**
 * Diffs what landed in Turso against the Supabase export it came from.
 *
 * Row counts are the easy half. The half that matters is whether the values
 * survived the shape changes: lists that became JSON, timestamps that made a
 * round trip through a string, booleans that are now integers underneath.
 *
 *   node --env-file=.env.local --experimental-strip-types scripts/verify-import.mts
 */
import { readFileSync } from "node:fs";

import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "../src/generated/prisma/client.js";
import { parseList } from "../src/lib/json-list.ts";

type Row = Record<string, unknown>;

const { tables } = JSON.parse(
  readFileSync("backup/supabase-export.json", "utf8"),
) as { tables: Record<string, Row[]> };

const db = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }),
});

const results: { label: string; ok: boolean }[] = [];
const check = (label: string, ok: boolean, detail = "") => {
  results.push({ label, ok });
  console.log(`${ok ? "  OK  " : " GAGAL"}  ${label}${detail ? " — " + detail : ""}`);
};

// ── jumlah baris per tabel ──────────────────────────────────────────────────
const counts: [string, number, number][] = [
  ["admin_users", tables.admin_users.length, await db.adminUser.count()],
  ["site_settings", tables.site_settings.length, await db.siteSettings.count()],
  ["menu_categories", tables.menu_categories.length, await db.menuCategory.count()],
  ["menu_items", tables.menu_items.length, await db.menuItem.count()],
  ["menu_item_categories", tables.menu_item_categories.length, await db.menuItemCategory.count()],
  ["gallery_items", tables.gallery_items.length, await db.galleryItem.count()],
  ["testimonials", tables.testimonials.length, await db.testimonial.count()],
  ["clients", tables.clients.length, await db.client.count()],
  ["faqs", tables.faqs.length, await db.faq.count()],
];
const beda = counts.filter(([, a, b]) => a !== b);
check("jumlah baris sembilan tabel sama dengan ekspor", beda.length === 0,
  beda.map(([t, a, b]) => `${t}: ${a}→${b}`).join("; ") ||
    counts.map(([t, a]) => `${t}=${a}`).join(" "));

// ── menu: setiap baris dicocokkan field demi field ──────────────────────────
const turso = await db.menuItem.findMany();
const byId = new Map(turso.map((m) => [m.id, m]));

const salah: string[] = [];
for (const asal of tables.menu_items) {
  const kini = byId.get(String(asal.id));
  if (!kini) { salah.push(`${asal.slug}: hilang`); continue; }

  if (kini.name !== asal.name) salah.push(`${asal.slug}: nama`);
  if (kini.slug !== asal.slug) salah.push(`${asal.slug}: slug`);
  if (kini.description !== asal.description) salah.push(`${asal.slug}: deskripsi`);
  if (kini.price !== asal.price) salah.push(`${asal.slug}: harga`);
  if (kini.priceUnit !== asal.priceUnit) salah.push(`${asal.slug}: satuan`);
  if (kini.imageUrl !== asal.imageUrl) salah.push(`${asal.slug}: foto`);
  if (kini.isPublished !== asal.isPublished) salah.push(`${asal.slug}: isPublished`);
  if (kini.isFeatured !== asal.isFeatured) salah.push(`${asal.slug}: isFeatured`);
  if (kini.sortOrder !== asal.sortOrder) salah.push(`${asal.slug}: urutan`);

  for (const f of ["packageItems", "galleryImages", "tags"] as const) {
    const sebelum = (asal[f] as string[]) ?? [];
    const sesudah = parseList(kini[f]);
    if (JSON.stringify(sebelum) !== JSON.stringify(sesudah)) {
      salah.push(`${asal.slug}: ${f} (${sebelum.length}→${sesudah.length})`);
    }
  }

  if (new Date(String(asal.createdAt)).getTime() !== kini.createdAt.getTime()) {
    salah.push(`${asal.slug}: createdAt`);
  }
}
check("13 paket cocok field demi field, termasuk ketiga kolom list",
  salah.length === 0, salah.slice(0, 4).join("; ") || "semua identik");

// ── yang cuma ada di Supabase, bukan di seed ────────────────────────────────
const kemerdekaan = turso.find((m) =>
  m.name.toLowerCase().includes("kemerdekaan"),
);
check("paket buatan pemilik ada di Turso", Boolean(kemerdekaan),
  kemerdekaan?.name ?? "hilang");

const cloud = turso.filter((m) => m.imageUrl?.includes("res.cloudinary.com")).length
  + (await db.galleryItem.count({ where: { imageUrl: { contains: "res.cloudinary.com" } } }))
  + (await db.testimonial.count({ where: { imageUrl: { contains: "res.cloudinary.com" } } }));
check("tautan Cloudinary terbawa", cloud > 0, `${cloud} record berfoto`);

// ── akun admin: hash harus identik, kalau tidak password berubah ────────────
const admin = await db.adminUser.findFirstOrThrow();
const adminAsal = tables.admin_users[0];
check("hash password admin identik dengan sebelumnya",
  admin.passwordHash === adminAsal.passwordHash && admin.email === adminAsal.email,
  `${admin.email} · role ${admin.role}`);

// ── join menu↔kategori ──────────────────────────────────────────────────────
const joinAsal = new Set(
  tables.menu_item_categories.map((j) => `${j.menuItemId}|${j.categoryId}`),
);
const joinKini = new Set(
  (await db.menuItemCategory.findMany()).map((j) => `${j.menuItemId}|${j.categoryId}`),
);
const hilang = [...joinAsal].filter((k) => !joinKini.has(k));
check("35 pasangan menu↔kategori sama persis",
  hilang.length === 0 && joinAsal.size === joinKini.size,
  `${joinKini.size} pasangan, ${hilang.length} hilang`);

// ── site settings: nomor WhatsApp adalah seluruh jalur pemesanan ────────────
const s = await db.siteSettings.findUniqueOrThrow({ where: { id: "default" } });
const sAsal = tables.site_settings[0];
check("site settings utuh, termasuk nomor WhatsApp",
  s.whatsappNumber === sAsal.whatsappNumber && s.brandName === sAsal.brandName,
  `${s.brandName} · ${String(s.whatsappNumber).slice(0, 4)}…`);

await db.$disconnect();

const gagal = results.filter((r) => !r.ok);
console.log(`\n=== ${results.length - gagal.length}/${results.length} lulus ===`);
if (gagal.length) console.log("GAGAL: " + gagal.map((f) => f.label).join("; "));
process.exit(gagal.length ? 1 : 0);
