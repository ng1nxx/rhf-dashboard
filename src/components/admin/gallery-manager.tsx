"use client";

import { AdminRow, Cell, PublishBadge } from "@/components/admin/admin-page";
import {
  GalleryForm,
  type GalleryRecord,
} from "@/components/admin/gallery-form";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import {
  deleteGalleryItem,
  toggleGalleryItemPublished,
} from "@/lib/admin/actions/gallery";
import type { Paged } from "@/lib/admin/pagination";

/** The gallery list and the drawer that edits it — PRD §12.5. */
export function GalleryManager({
  page,
  nextSortOrder,
}: {
  page: Paged<GalleryRecord>;
  nextSortOrder: number;
}) {
  return (
    <RecordList
      title="Galeri"
      newLabel="Tambah foto"
      pathname="/admin/galeri"
      page={page}
      label="foto"
      searchPlaceholder="Cari judul, keterangan, atau kategori…"
      headers={["Foto", "Kategori", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada foto di galeri."
      addTitle="Tambah foto"
      editTitle="Ubah foto"
      describe={(item) => item.title ?? "Foto tanpa judul"}
      renderRow={(item, edit) => (
        <AdminRow>
          <Cell className="max-w-sm">
            <p className="font-semibold text-rhf-charcoal">
              {item.title ?? "(tanpa judul)"}
            </p>
            <p className="mt-0.5 line-clamp-1 text-muted-foreground">
              {item.imageUrl ?? "Belum ada foto — memakai gambar sementara"}
            </p>
          </Cell>

          <Cell className="text-muted-foreground">{item.category ?? "—"}</Cell>

          <Cell className="tabular-nums text-muted-foreground">
            {item.sortOrder}
          </Cell>

          <Cell>
            <PublishBadge isPublished={item.isPublished} />
          </Cell>

          <RowActions
            recordName={item.title ?? "foto ini"}
            isPublished={item.isPublished}
            togglePublish={toggleGalleryItemPublished.bind(
              null,
              item.id,
              !item.isPublished,
            )}
            onEdit={edit}
            remove={deleteGalleryItem.bind(null, item.id)}
          />
        </AdminRow>
      )}
      renderForm={(item, controls) => (
        <GalleryForm item={item} nextSortOrder={nextSortOrder} {...controls} />
      )}
    />
  );
}
