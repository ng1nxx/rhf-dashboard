"use client";

import { AdminRow, Cell, PublishBadge } from "@/components/admin/admin-page";
import {
  CategoryForm,
  type CategoryRecord,
} from "@/components/admin/category-form";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import { CategoryIcon } from "@/components/shared/category-icon";
import {
  deleteCategory,
  toggleCategoryPublished,
} from "@/lib/admin/actions/categories";
import type { Paged } from "@/lib/admin/pagination";

/** The category list and the drawer that edits it — PRD §12.4. */
export function CategoryManager({
  page,
  usage,
  nextSortOrder,
}: {
  page: Paged<CategoryRecord>;
  /** How many packages use each category, keyed by id. */
  usage: Record<string, number>;
  nextSortOrder: number;
}) {
  return (
    <RecordList
      title="Kategori"
      newLabel="Tambah kategori"
      pathname="/admin/kategori"
      page={page}
      label="kategori"
      searchPlaceholder="Cari nama atau slug kategori…"
      headers={["Kategori", "Dipakai", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada kategori."
      addTitle="Tambah kategori"
      editTitle="Ubah kategori"
      describe={(category) => category.name}
      renderRow={(category, edit) => {
        const used = usage[category.id] ?? 0;

        return (
          <AdminRow>
            <Cell>
              <div className="flex items-center gap-2.5">
                {/* Resolves the stored `icon` key, not a guess from the name —
                    otherwise changing the icon in the form would have no
                    visible effect on this list. */}
                <CategoryIcon
                  iconKey={category.icon ?? undefined}
                  aria-hidden
                  className="size-4.5 shrink-0 text-rhf-deep-orange"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-rhf-charcoal">
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{category.slug}
                  </p>
                </div>
              </div>
            </Cell>

            <Cell className="text-muted-foreground">{used} paket</Cell>

            <Cell className="tabular-nums text-muted-foreground">
              {category.sortOrder}
            </Cell>

            <Cell>
              <PublishBadge isPublished={category.isPublished} />
            </Cell>

            <RowActions
              recordName={category.name}
              isPublished={category.isPublished}
              togglePublish={toggleCategoryPublished.bind(
                null,
                category.id,
                !category.isPublished,
              )}
              onEdit={edit}
              remove={deleteCategory.bind(null, category.id)}
              deleteWarning={
                used > 0
                  ? `Kategori ini masih dipakai ${used} paket, dan label itu akan hilang dari paket-paket tersebut.`
                  : undefined
              }
            />
          </AdminRow>
        );
      }}
      renderForm={(category, controls) => (
        <CategoryForm
          category={category}
          nextSortOrder={nextSortOrder}
          {...controls}
        />
      )}
    />
  );
}
