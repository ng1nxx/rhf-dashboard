"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useState } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { DataTableSection } from "@/components/admin/data-table";
import { RecordDrawer } from "@/components/admin/record-drawer";
import type { Paged } from "@/lib/admin/pagination";

/**
 * One admin collection: the table, and the drawer that adds to and edits it.
 *
 * All six list screens are the same screen — a header with one button, a
 * searchable paginated table, and a side panel holding the form. Only the
 * columns and the form differ, so they are what a caller supplies; everything
 * else, including the open/closed state machine, is settled here once.
 *
 * A client component because the drawer is state: which record is being edited
 * has to change without a navigation, which is the whole point of the drawer.
 * The table inside it is still server-rendered — the rows arrive as props from
 * a server component, already narrowed to one page by the database.
 */

export type DrawerControls = {
  /** Closes the panel, discarding whatever was typed. */
  onCancel: () => void;
  /** Closes it and reloads the list behind it. Only after a write commits. */
  onSaved: () => void;
};

export function RecordList<Row extends { id: string }>({
  title,
  newLabel,
  notice,
  pathname,
  page,
  label,
  searchPlaceholder,
  headers,
  emptyMessage,
  addTitle,
  editTitle,
  describe,
  renderRow,
  renderForm,
}: {
  title: string;
  newLabel: string;
  /** Sits between the header and the table — a rule that governs every row. */
  notice?: React.ReactNode;
  pathname: string;
  page: Paged<Row>;
  /** Plural noun for the counts and messages, e.g. "paket". */
  label: string;
  searchPlaceholder: string;
  headers: string[];
  emptyMessage: string;
  addTitle: string;
  editTitle: string;
  /** Names the record under the drawer title, so the target is unambiguous. */
  describe?: (row: Row) => string;
  renderRow: (row: Row, edit: () => void) => React.ReactNode;
  renderForm: (
    row: Row | undefined,
    controls: DrawerControls,
  ) => React.ReactNode;
}) {
  const router = useRouter();

  // `undefined` = closed. `null` = open on a new record. A record = editing it.
  // Three states, because "open" and "which record" are one question here: the
  // drawer cannot be open without knowing what it is showing.
  const [editing, setEditing] = useState<Row | null | undefined>(undefined);

  const close = useCallback(() => setEditing(undefined), []);

  // The list behind the drawer was rendered on the server, so it does not know
  // a write happened. `refresh()` re-runs the page's query and swaps the rows
  // in place, keeping the search term, the page, and the scroll position.
  const saved = useCallback(() => {
    setEditing(undefined);
    router.refresh();
  }, [router]);

  return (
    <>
      <AdminPageHeader
        title={title}
        newLabel={newLabel}
        onNew={() => setEditing(null)}
      />

      {notice}

      <DataTableSection
        pathname={pathname}
        page={page}
        label={label}
        searchPlaceholder={searchPlaceholder}
        headers={headers}
        emptyMessage={emptyMessage}
      >
        {page.rows.map((row) => (
          <Fragment key={row.id}>
            {renderRow(row, () => setEditing(row))}
          </Fragment>
        ))}
      </DataTableSection>

      <RecordDrawer
        open={editing !== undefined}
        onOpenChange={(open) => {
          if (!open) close();
        }}
        title={editing ? editTitle : addTitle}
        description={editing ? describe?.(editing) : undefined}
      >
        {/*
          Keyed so the subtree is thrown away when the target changes. The
          fields are uncontrolled and seeded with `defaultValue`, which React
          only reads on mount — without this, clicking a second row would show
          the first row's values in an otherwise correct-looking form.
        */}
        <Fragment key={editing?.id ?? "baru"}>
          {renderForm(editing ?? undefined, {
            onCancel: close,
            onSaved: saved,
          })}
        </Fragment>
      </RecordDrawer>
    </>
  );
}
