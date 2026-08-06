"use client";

import { AdminRow, Cell, PublishBadge } from "@/components/admin/admin-page";
import { FaqForm, type FaqRecord } from "@/components/admin/faq-form";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import { deleteFaq, toggleFaqPublished } from "@/lib/admin/actions/faq";
import type { Paged } from "@/lib/admin/pagination";

/** The FAQ list and the drawer that edits it — PRD §12.8. */
export function FaqManager({
  page,
  nextSortOrder,
}: {
  page: Paged<FaqRecord>;
  /** Read from the whole table on the server — see the page component. */
  nextSortOrder: number;
}) {
  return (
    <RecordList
      title="FAQ"
      newLabel="Tambah FAQ"
      pathname="/admin/faq"
      page={page}
      label="FAQ"
      searchPlaceholder="Cari pertanyaan atau jawaban…"
      headers={["Pertanyaan", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada FAQ. Tambahkan pertanyaan yang sering ditanyakan pelanggan."
      addTitle="Tambah FAQ"
      editTitle="Ubah FAQ"
      describe={(faq) => faq.question}
      renderRow={(faq, edit) => (
        <AdminRow>
          <Cell className="max-w-md">
            <p className="font-semibold text-rhf-charcoal">{faq.question}</p>
            <p className="mt-0.5 line-clamp-1 text-muted-foreground">
              {faq.answer}
            </p>
          </Cell>

          <Cell className="tabular-nums text-muted-foreground">
            {faq.sortOrder}
          </Cell>

          <Cell>
            <PublishBadge isPublished={faq.isPublished} />
          </Cell>

          <RowActions
            recordName={faq.question}
            isPublished={faq.isPublished}
            togglePublish={toggleFaqPublished.bind(
              null,
              faq.id,
              !faq.isPublished,
            )}
            onEdit={edit}
            remove={deleteFaq.bind(null, faq.id)}
          />
        </AdminRow>
      )}
      renderForm={(faq, controls) => (
        <FaqForm faq={faq} nextSortOrder={nextSortOrder} {...controls} />
      )}
    />
  );
}
