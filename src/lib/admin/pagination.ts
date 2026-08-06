/**
 * Table state that lives in the URL — PRD §15.3.
 *
 * Page, page size, and the search term are read from the query string rather
 * than held in component state, which is what makes the tables server
 * rendered: the database returns one page, not the whole collection filtered
 * afterwards. It also means the back button works, a link to page 3 of a
 * search is a real link, and reloading after an edit lands where the person
 * was rather than at the top.
 */

export const PAGE_SIZES = [10, 25, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;

export type TableParams = {
  /** Search term, already trimmed. Empty string means "no filter". */
  q: string;
  page: number;
  perPage: number;
};

/** What a Next.js page receives; a repeated key arrives as an array. */
export type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/**
 * Turns raw query-string values into something safe to hand a query.
 *
 * Everything here is attacker-controlled — these values arrive straight from
 * the address bar — so nothing is trusted: the page number is forced to a
 * positive integer, and the page size must be one of the offered sizes rather
 * than any number, otherwise `?per=100000` becomes a way to make the panel ask
 * Supabase for every row at once.
 */
export function readTableParams(searchParams: SearchParams): TableParams {
  const page = Number.parseInt(first(searchParams.page), 10);
  const perPage = Number.parseInt(first(searchParams.per), 10);

  return {
    q: first(searchParams.q).trim(),
    page: Number.isFinite(page) && page > 0 ? page : 1,
    perPage: (PAGE_SIZES as readonly number[]).includes(perPage)
      ? perPage
      : DEFAULT_PAGE_SIZE,
  };
}

export type Paged<Row> = {
  rows: Row[];
  /** Rows matching the filter, across every page. */
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  /** 1-based position of the first and last row shown, for "1–10 dari 13". */
  from: number;
  to: number;
  /** Echoed back so the toolbar and the page links can rebuild the URL. */
  q: string;
};

/**
 * Assembles the result once the count and the rows are known.
 *
 * `page` is clamped against the real page count here rather than trusted from
 * the URL. Being on page 3 and deleting the last few records would otherwise
 * leave an empty table with working pagination and no hint of what happened.
 */
export function toPaged<Row>(
  rows: Row[],
  total: number,
  params: TableParams,
): Paged<Row> {
  const pageCount = Math.max(1, Math.ceil(total / params.perPage));
  const page = Math.min(params.page, pageCount);

  return {
    rows,
    total,
    page,
    perPage: params.perPage,
    pageCount,
    from: total === 0 ? 0 : (page - 1) * params.perPage + 1,
    to: Math.min(page * params.perPage, total),
    q: params.q,
  };
}

/**
 * Where the rows for a page start.
 *
 * Takes the clamped page so a stale `?page=9` reads the last page rather than
 * skipping past the end of the table.
 */
export function skipFor(params: TableParams, pageCount: number): number {
  return (Math.min(params.page, Math.max(1, pageCount)) - 1) * params.perPage;
}

/** Builds a URL for this table with some parts of its state replaced. */
export function tableHref(
  pathname: string,
  current: { q: string; page: number; perPage: number },
  changes: Partial<{ q: string; page: number; perPage: number }>,
): string {
  const next = { ...current, ...changes };
  const search = new URLSearchParams();

  if (next.q) search.set("q", next.q);
  if (next.page > 1) search.set("page", String(next.page));
  if (next.perPage !== DEFAULT_PAGE_SIZE) search.set("per", String(next.perPage));

  const query = search.toString();

  return query ? `${pathname}?${query}` : pathname;
}
