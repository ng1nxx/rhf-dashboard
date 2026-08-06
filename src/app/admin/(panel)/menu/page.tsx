import { MenuManager } from "@/components/admin/menu-manager";
import {
  listCategoryOptions,
  listMenuItems,
  nextMenuItemSortOrder,
} from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * Menu packages — PRD §12.3.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over. Three separate reads, because they answer three different
 * questions:
 *
 *   - the page of rows the table shows;
 *   - every category, since a package may be assigned to one that is not on
 *     this page — or not published at all;
 *   - the highest `sortOrder` in the whole table, which cannot be derived from
 *     one page without giving new packages a position that collides with
 *     existing ones.
 */
export default async function AdminMenuPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [items, categories, nextSortOrder] = await Promise.all([
    listMenuItems(params),
    listCategoryOptions(),
    nextMenuItemSortOrder(),
  ]);

  return (
    <MenuManager
      page={items}
      categories={categories}
      nextSortOrder={nextSortOrder}
    />
  );
}
