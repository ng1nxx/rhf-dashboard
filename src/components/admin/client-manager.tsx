"use client";

import { AdminRow, Cell, PublishBadge } from "@/components/admin/admin-page";
import { ClientForm, type ClientRecord } from "@/components/admin/client-form";
import { RecordList } from "@/components/admin/record-list";
import { RowActions } from "@/components/admin/row-actions";
import {
  deleteClient,
  toggleClientPublished,
} from "@/lib/admin/actions/clients";
import type { Paged } from "@/lib/admin/pagination";

/**
 * The client list and the drawer that edits it — PRD §12.7.
 *
 * "Disembunyikan" here means "no consent recorded yet", which is why the notice
 * sits above the table rather than inside the form: it governs whether a row
 * should be published at all, not just how one field is filled in.
 */
export function ClientManager({
  page,
  nextSortOrder,
}: {
  page: Paged<ClientRecord>;
  nextSortOrder: number;
}) {
  return (
    <RecordList
      title="Client / Instansi"
      newLabel="Tambah client"
      notice={
        <p className="mx-4 mt-4 rounded-lg border border-rhf-border bg-rhf-cream px-3.5 py-2.5 text-sm text-rhf-brown sm:mx-6">
          Nama atau logo client hanya boleh ditampilkan setelah ada izin. Selama
          tidak ada yang ditampilkan, website memakai copy umum tanpa menyebut
          nama.
        </p>
      }
      pathname="/admin/client"
      page={page}
      label="client"
      searchPlaceholder="Cari nama atau kategori client…"
      headers={["Client", "Kategori", "Urutan", "Status", "Aksi"]}
      emptyMessage="Belum ada client tercatat."
      addTitle="Tambah client"
      editTitle="Ubah client"
      describe={(client) => client.name}
      renderRow={(client, edit) => (
        <AdminRow>
          <Cell>
            <p className="font-semibold text-rhf-charcoal">{client.name}</p>
          </Cell>

          <Cell className="text-muted-foreground">
            {client.category ?? "—"}
          </Cell>

          <Cell className="tabular-nums text-muted-foreground">
            {client.sortOrder}
          </Cell>

          <Cell>
            <PublishBadge isPublished={client.isPublished} />
          </Cell>

          <RowActions
            recordName={client.name}
            isPublished={client.isPublished}
            togglePublish={toggleClientPublished.bind(
              null,
              client.id,
              !client.isPublished,
            )}
            onEdit={edit}
            remove={deleteClient.bind(null, client.id)}
          />
        </AdminRow>
      )}
      renderForm={(client, controls) => (
        <ClientForm
          client={client}
          nextSortOrder={nextSortOrder}
          {...controls}
        />
      )}
    />
  );
}
