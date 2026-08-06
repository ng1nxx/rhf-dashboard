import "server-only";

import { db } from "@/lib/db";

/**
 * Reads for the admin panel.
 *
 * Deliberately separate from `lib/repositories/`. That layer drops every
 * record with `isPublished: false` before returning — which is exactly right
 * for the public site and exactly wrong here, because the admin needs to see
 * and count the things a visitor cannot.
 */

export type EntityCount = {
  /** Visible on the public website right now. */
  published: number;
  /** Everything stored, published or not. */
  total: number;
};

export type DashboardStats = {
  menuItems: EntityCount;
  categories: EntityCount;
  gallery: EntityCount;
  testimonials: EntityCount;
  clients: EntityCount;
};

/**
 * The five counts of PRD §12.2.
 *
 * PRD asks only for the active totals, but each card reports published *and*
 * total. An owner who unpublishes a package needs to see it still exists;
 * given only the active figure, hidden records look deleted.
 *
 * Ten counts go out in one `$transaction`, so this is a single round trip to
 * Supabase rather than ten sequential ones over the pooler.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const published = { isPublished: true };

  const [
    menuPublished,
    menuTotal,
    categoryPublished,
    categoryTotal,
    galleryPublished,
    galleryTotal,
    testimonialPublished,
    testimonialTotal,
    clientPublished,
    clientTotal,
  ] = await db.$transaction([
    db.menuItem.count({ where: published }),
    db.menuItem.count(),
    db.menuCategory.count({ where: published }),
    db.menuCategory.count(),
    db.galleryItem.count({ where: published }),
    db.galleryItem.count(),
    db.testimonial.count({ where: published }),
    db.testimonial.count(),
    db.client.count({ where: published }),
    db.client.count(),
  ]);

  return {
    menuItems: { published: menuPublished, total: menuTotal },
    categories: { published: categoryPublished, total: categoryTotal },
    gallery: { published: galleryPublished, total: galleryTotal },
    testimonials: { published: testimonialPublished, total: testimonialTotal },
    clients: { published: clientPublished, total: clientTotal },
  };
}
