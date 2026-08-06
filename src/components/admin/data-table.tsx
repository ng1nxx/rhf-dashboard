import Link from "next/link";

import { AdminTable, EmptyState } from "@/components/admin/admin-page";
import { TableToolbar } from "@/components/admin/table-toolbar";
import { Button } from "@/components/ui/button";
import {
  PAGE_SIZES,
  tableHref,
  type Paged,
} from "@/lib/admin/pagination";

/**
 * The paging controls under an admin table — PRD §15.3.
 *
 * Every control is a real `<Link>`, so a page is a URL: reachable by the back
 * button, bookmarkable, and rendered on the server without waiting for
 * JavaScript. The search box and the page-size picker need an event handler
 * and live in `table-toolbar.tsx`; everything else stays server rendered.
 */

/** How many numbered links to show around the current page. */
const WINDOW = 2;

function pageNumbers(page: number, pageCount: number): (number | "gap")[] {
  const wanted = new Set<number>([1, pageCount]);

  for (let n = page - WINDOW; n <= page + WINDOW; n++) {
    if (n >= 1 && n <= pageCount) wanted.add(n);
  }

  const sorted = [...wanted].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];

  for (const [index, n] of sorted.entries()) {
    // A single skipped page is not worth an ellipsis — show the page instead.
    if (index > 0 && n - sorted[index - 1] === 2) out.push(n - 1);
    else if (index > 0 && n - sorted[index - 1] > 2) out.push("gap");
    out.push(n);
  }

  return out;
}

export function TablePagination({
  pathname,
  page: state,
  label,
}: {
  pathname: string;
  page: Pick<
    Paged<unknown>,
    "page" | "pageCount" | "perPage" | "total" | "from" | "to" | "q"
  >;
  /** Plural noun for the count, e.g. "paket". */
  label: string;
}) {
  const { page, pageCount, perPage, total, from, to, q } = state;
  const current = { q, page, perPage };
  const href = (changes: Parameters<typeof tableHref>[2]) =>
    tableHref(pathname, current, changes);

  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {total === 0 ? (
          <>Tidak ada {label}.</>
        ) : (
          <>
            Menampilkan{" "}
            <span className="font-semibold text-rhf-charcoal">
              {from}–{to}
            </span>{" "}
            dari {total} {label}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Tampilkan</span>
          {PAGE_SIZES.map((size) => (
            <Button
              key={size}
              asChild
              variant={size === perPage ? "rhf" : "ghost"}
              size="sm"
              className="h-8 px-2.5 text-xs"
            >
              {/* Changing the page size sends the person back to page 1 —
                  row 41 of the old paging is not row 41 of the new one. */}
              <Link href={href({ perPage: size, page: 1 })}>{size}</Link>
            </Button>
          ))}
        </div>

        {pageCount > 1 ? (
          <nav aria-label="Navigasi halaman" className="flex items-center gap-1">
            <Button
              asChild={page > 1}
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs"
              disabled={page === 1}
            >
              {page > 1 ? (
                <Link href={href({ page: page - 1 })} rel="prev">
                  Sebelumnya
                </Link>
              ) : (
                <span>Sebelumnya</span>
              )}
            </Button>

            {pageNumbers(page, pageCount).map((n, index) =>
              n === "gap" ? (
                <span
                  key={`gap-${index}`}
                  aria-hidden
                  className="px-1 text-xs text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={n}
                  asChild
                  variant={n === page ? "rhf" : "ghost"}
                  size="sm"
                  className="h-8 min-w-8 px-2 text-xs"
                >
                  <Link
                    href={href({ page: n })}
                    aria-current={n === page ? "page" : undefined}
                    aria-label={`Halaman ${n}`}
                  >
                    {n}
                  </Link>
                </Button>
              ),
            )}

            <Button
              asChild={page < pageCount}
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs"
              disabled={page === pageCount}
            >
              {page < pageCount ? (
                <Link href={href({ page: page + 1 })} rel="next">
                  Berikutnya
                </Link>
              ) : (
                <span>Berikutnya</span>
              )}
            </Button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Search box, table, and paging around one collection.
 *
 * Every list screen has the same three parts in the same order, so they are
 * assembled once here; a page only says what its columns are and how to draw
 * a row.
 *
 * "No records yet" and "nothing matched your search" are different situations
 * and get different messages — telling someone to add their first FAQ when
 * they have ten and mistyped a search is the sort of thing that makes a panel
 * feel broken.
 */
export function DataTableSection({
  pathname,
  page,
  label,
  searchPlaceholder,
  headers,
  emptyMessage,
  children,
}: {
  pathname: string;
  page: Pick<
    Paged<unknown>,
    "page" | "pageCount" | "perPage" | "total" | "from" | "to" | "q"
  >;
  label: string;
  searchPlaceholder: string;
  headers: string[];
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
      <TableToolbar
        pathname={pathname}
        q={page.q}
        perPage={page.perPage}
        placeholder={searchPlaceholder}
      />

      {page.total === 0 ? (
        <EmptyState
          message={
            page.q
              ? `Tidak ada ${label} yang cocok dengan “${page.q}”.`
              : emptyMessage
          }
        />
      ) : (
        <>
          <AdminTable headers={headers}>{children}</AdminTable>
          <TablePagination pathname={pathname} page={page} label={label} />
        </>
      )}
    </div>
  );
}

export { TableToolbar };
