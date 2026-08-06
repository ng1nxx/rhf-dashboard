/**
 * Database seed — PRD §23.
 *
 * Loads the same content the site currently renders from `src/lib/seed/` into
 * Turso, so the switch from seed modules to the database is invisible to
 * visitors. Idempotent: every write is an upsert keyed on a stable id or slug,
 * so re-running never duplicates rows.
 *
 * Run with:  npm run db:seed
 *
 * Note: seeded testimonials are placeholders, not real customer quotes. See
 * PRELAUNCH.md before going live.
 */
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";
import { serializeList } from "../src/lib/json-list";

import { CATEGORIES } from "../src/lib/seed/categories";
import { CLIENTS } from "../src/lib/seed/clients";
import { FAQS } from "../src/lib/seed/faqs";
import { GALLERY_ITEMS } from "../src/lib/seed/gallery";
import { MENU_ITEMS } from "../src/lib/seed/menu-items";
import { SITE_SETTINGS } from "../src/lib/seed/site-settings";
import { TESTIMONIALS } from "../src/lib/seed/testimonials";

// Writes go to Turso, the same database the application uses — Prisma 7 needs
// an explicit driver adapter, there is no engine to hand a bare connection
// string to any more.
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  throw new Error(
    "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN belum diset di .env.local.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url, authToken }),
});

async function main() {
  console.log("Seeding site settings…");
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: SITE_SETTINGS,
    create: { id: "default", ...SITE_SETTINGS },
  });

  console.log(`Seeding ${CATEGORIES.length} categories…`);
  for (const category of CATEGORIES) {
    await prisma.menuCategory.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  console.log(`Seeding ${MENU_ITEMS.length} menu items…`);
  for (const item of MENU_ITEMS) {
    const { categoryIds, createdAt, packageItems, galleryImages, tags, ...rest } =
      item;

    // The three list columns hold JSON on SQLite — see src/lib/json-list.ts.
    const fields = {
      ...rest,
      packageItems: serializeList(packageItems ?? []),
      galleryImages: serializeList(galleryImages ?? []),
      tags: serializeList(tags ?? []),
    };

    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: fields,
      create: { ...fields, createdAt: new Date(createdAt) },
    });

    // Replace the category links wholesale so a re-run reflects the current
    // seed rather than accumulating stale associations. Deleting first means
    // there is nothing left to collide with, so no `skipDuplicates` is needed —
    // which SQLite does not support anyway.
    await prisma.menuItemCategory.deleteMany({ where: { menuItemId: item.id } });
    await prisma.menuItemCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        menuItemId: item.id,
        categoryId,
      })),
    });
  }

  console.log(`Seeding ${GALLERY_ITEMS.length} gallery items…`);
  for (const galleryItem of GALLERY_ITEMS) {
    await prisma.galleryItem.upsert({
      where: { id: galleryItem.id },
      update: galleryItem,
      create: galleryItem,
    });
  }

  console.log(`Seeding ${TESTIMONIALS.length} testimonials (placeholders)…`);
  for (const testimonial of TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: testimonial,
      create: testimonial,
    });
  }

  console.log(`Seeding ${CLIENTS.length} clients…`);
  for (const client of CLIENTS) {
    await prisma.client.upsert({
      where: { id: client.id },
      update: client,
      create: client,
    });
  }

  console.log(`Seeding ${FAQS.length} FAQ entries…`);
  for (const faq of FAQS) {
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq,
    });
  }

  await seedAdminUser();

  console.log("Seed complete.");
}

/**
 * Bootstraps the first admin account from env — PRD §16.3.
 *
 * Skipped silently when the variables are absent, so `db:seed` stays usable for
 * content-only runs. The password is hashed here and never stored as typed
 * (PRD §21).
 *
 * An existing account is left alone: re-running the seed after the owner has
 * changed their password must not reset it back to the bootstrap value.
 */
async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !password) {
    console.log("Skipping admin bootstrap — ADMIN_EMAIL/ADMIN_INITIAL_PASSWORD belum diset.");
    return;
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin ${email} sudah ada — password tidak diubah.`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      name: "Admin RHF",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`Admin ${email} dibuat. Ganti passwordnya setelah login pertama.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
