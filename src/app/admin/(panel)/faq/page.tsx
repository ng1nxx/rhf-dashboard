import { FaqManager } from "@/components/admin/faq-manager";
import { listFaqs, nextFaqSortOrder } from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * FAQ list — PRD §12.8.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over. The second read is the highest `sortOrder` in the whole
 * table: it cannot be derived from one page without giving new entries a
 * position that collides with rows further down.
 */
export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [faqs, nextSortOrder] = await Promise.all([
    listFaqs(params),
    nextFaqSortOrder(),
  ]);

  return <FaqManager page={faqs} nextSortOrder={nextSortOrder} />;
}
