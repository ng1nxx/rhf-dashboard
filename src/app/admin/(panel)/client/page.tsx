import { ClientManager } from "@/components/admin/client-manager";
import { listClients, nextClientSortOrder } from "@/lib/admin/list-queries";
import { readTableParams, type SearchParams } from "@/lib/admin/pagination";
import { verifySession } from "@/lib/auth/dal";

/**
 * Client list — PRD §12.7.
 *
 * Adding and editing happen in a drawer, so this page only authorises, loads,
 * and hands over.
 */
export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await verifySession();

  const params = readTableParams(await searchParams);
  const [clients, nextSortOrder] = await Promise.all([
    listClients(params),
    nextClientSortOrder(),
  ]);

  return <ClientManager page={clients} nextSortOrder={nextSortOrder} />;
}
