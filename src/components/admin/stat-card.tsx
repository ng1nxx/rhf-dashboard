import type { LucideIcon } from "lucide-react";

import type { EntityCount } from "@/lib/admin/queries";

/**
 * One content count on the dashboard — PRD §12.2.
 *
 * The headline number is what the public can see. The line under it reports
 * the stored total, and names the gap when the two differ: without it, a
 * package the owner unpublished simply vanishes from the dashboard and looks
 * deleted.
 */
export function StatCard({
  label,
  count,
  icon: Icon,
}: {
  label: string;
  count: EntityCount;
  icon: LucideIcon;
}) {
  const hidden = count.total - count.published;

  return (
    <div className="rounded-xl border border-rhf-border bg-white p-5 shadow-rhf-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-rhf-cream text-rhf-deep-orange">
          <Icon aria-hidden className="size-4.5" />
        </span>
        <p className="text-sm font-semibold text-rhf-charcoal">{label}</p>
      </div>

      <p className="mt-4 font-heading text-3xl font-extrabold text-rhf-charcoal tabular-nums">
        {count.published}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {hidden > 0
          ? `tampil di website · ${hidden} disembunyikan`
          : "tampil di website"}
      </p>
    </div>
  );
}
