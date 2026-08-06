import { Plus } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

/**
 * Header bar shared by every admin screen — the sidebar toggle, the page name,
 * and (on list pages) the button that creates a record.
 *
 * The toggle lives here rather than in the panel layout because it must sit
 * beside the page title, and on mobile it is the only way to reach navigation.
 */
export function AdminPageHeader({
  title,
  newLabel,
  onNew,
}: {
  title: string;
  newLabel?: string;
  /** Opens the drawer on a blank record. Absent on screens with no list. */
  onNew?: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-rhf-border bg-rhf-cream/90 px-4 backdrop-blur">
      <SidebarTrigger />

      <h1 className="font-heading text-base font-bold text-rhf-charcoal">
        {title}
      </h1>

      {onNew ? (
        <Button
          type="button"
          variant="rhf"
          size="sm"
          className="ml-auto"
          onClick={onNew}
        >
          <Plus aria-hidden />
          <span className="hidden sm:inline">{newLabel ?? "Tambah"}</span>
        </Button>
      ) : null}
    </header>
  );
}

/** Shown when a collection has no records yet. */
export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-rhf-border bg-white/60 px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

/**
 * The admin table — PRD §15.3.
 *
 * Wrapped in its own horizontal scroller: the owner may well be on a phone,
 * and a table that pushes the page sideways breaks every other screen with it.
 */
export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-rhf-border bg-white shadow-rhf-sm">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rhf-border">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3 text-xs font-semibold tracking-wide text-rhf-brown uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-rhf-border/60 last:border-0 hover:bg-rhf-cream/40">
      {children}
    </tr>
  );
}

export function Cell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}

/** Reads at a glance whether a record is live on the public website. */
export function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <span
      className={
        isPublished
          ? "inline-flex rounded-full bg-rhf-green/15 px-2.5 py-1 text-xs font-semibold text-rhf-green"
          : "inline-flex rounded-full bg-rhf-soft-gray px-2.5 py-1 text-xs font-semibold text-muted-foreground"
      }
    >
      {isPublished ? "Tampil" : "Disembunyikan"}
    </span>
  );
}
