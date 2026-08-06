import { GalleryManager } from "@/components/admin/gallery-manager";
import {
  listGalleryItems,
  nextGallerySortOrder,
} from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * Gallery list — PRD §12.5.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over.
 */
export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [items, nextSortOrder] = await Promise.all([
    listGalleryItems(params),
    nextGallerySortOrder(),
  ]);

  return <GalleryManager page={items} nextSortOrder={nextSortOrder} />;
}
