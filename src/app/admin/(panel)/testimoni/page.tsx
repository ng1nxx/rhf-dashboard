import { TestimonialManager } from "@/components/admin/testimonial-manager";
import {
  listTestimonials,
  nextTestimonialSortOrder,
} from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * Testimonial list — PRD §12.6.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over.
 */
export default async function AdminTestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [testimonials, nextSortOrder] = await Promise.all([
    listTestimonials(params),
    nextTestimonialSortOrder(),
  ]);

  return (
    <TestimonialManager page={testimonials} nextSortOrder={nextSortOrder} />
  );
}
