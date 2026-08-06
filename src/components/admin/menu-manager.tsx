"use client";

import { Star } from "lucide-react";
import Link from "next/link";

import {
  AdminRow,
  Cell,
  EmptyState,
  PublishBadge,
} from "@/components/admin/admin-page";
import {
  MenuItemForm,
  type CategoryOption,
  type MenuItemRecord,
} from "@/components/admin/menu-item-form";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import { Button } from "@/components/ui/button";
import {
  deleteMenuItem,
  toggleMenuItemPublished,
} from "@/lib/admin/actions/menu-items";
import type { Paged } from "@/lib/admin/pagination";
import { priceLabel } from "@/lib/menu-text";

/** The menu list and the drawer that edits it — PRD §12.3. */

type Row = MenuItemRecord & {
  categoryNames: string[];
};

export function MenuManager({
  page,
  categories,
  nextSortOrder,
}: {
  page: Paged<Row>;
  categories: CategoryOption[];
  /** Read from the whole table on the server — see the page component. */
  nextSortOrder: number;
}) {
  const noCategories = categories.length === 0;

  return (
    <RecordList
      title="Menu"
      newLabel="Tambah paket"
      pathname="/admin/menu"
      page={page}
      label="paket"
      searchPlaceholder="Cari nama paket, deskripsi, atau tag…"
      headers={["Paket", "Kategori", "Harga", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada paket menu."
      addTitle="Tambah paket"
      editTitle="Ubah paket"
      describe={(item) => item.name}
      renderRow={(item, edit) => (
        <AdminRow>
          <Cell>
            <div className="flex items-start gap-2">
              {item.isFeatured ? (
                <Star
                  aria-label="Paket unggulan"
                  className="mt-0.5 size-4 shrink-0 fill-rhf-orange text-rhf-orange"
                />
              ) : null}
              <div className="min-w-0">
                <p className="font-semibold text-rhf-charcoal">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  /menu/{item.slug}
                </p>
              </div>
            </div>
          </Cell>

          <Cell>
            <div className="flex flex-wrap gap-1">
              {item.categoryNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex rounded-full bg-rhf-cream px-2 py-0.5 text-xs text-rhf-brown"
                >
                  {name}
                </span>
              ))}
            </div>
          </Cell>

          {/* The same derived string the customer sees, built from the same
              helper the public pages use — so this column cannot drift from
              what the website shows. */}
          <Cell className="text-muted-foreground">
            {priceLabel(item.price, item.priceUnit)}
          </Cell>

          <Cell className="tabular-nums text-muted-foreground">
            {item.sortOrder}
          </Cell>

          <Cell>
            <PublishBadge isPublished={item.isPublished} />
          </Cell>

          <RowActions
            recordName={item.name}
            isPublished={item.isPublished}
            togglePublish={toggleMenuItemPublished.bind(
              null,
              item.id,
              !item.isPublished,
            )}
            onEdit={edit}
            remove={deleteMenuItem.bind(null, item.id)}
          />
        </AdminRow>
      )}
      renderForm={(item, controls) =>
        noCategories ? (
          // Every package needs at least one category, so with none defined the
          // form could be filled in completely and still refuse to save. Say so
          // up front instead of letting it be discovered on submit.
          <div className="flex flex-col items-start gap-4">
            <EmptyState message="Paket menu harus punya minimal satu kategori, dan belum ada kategori yang dibuat." />

            <Button asChild variant="rhf" size="rhf">
              <Link href="/admin/kategori">Buat kategori dulu</Link>
            </Button>
          </div>
        ) : (
          <MenuItemForm
            item={item}
            categories={categories}
            nextSortOrder={nextSortOrder}
            {...controls}
          />
        )
      }
    />
  );
}
