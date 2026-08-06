import { CategoryManager } from "@/components/admin/category-manager";
import {
  countMenuItemsPerCategory,
  listCategories,
  nextCategorySortOrder,
} from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * Category list — PRD §12.4.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over. The usage count is read across every category, not just this
 * page, because it is what the delete confirmation warns with.
 */
export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [categories, usage, nextSortOrder] = await Promise.all([
    listCategories(params),
    countMenuItemsPerCategory(),
    nextCategorySortOrder(),
  ]);

  return (
    <CategoryManager
      page={categories}
      usage={usage}
      nextSortOrder={nextSortOrder}
    />
  );
}
