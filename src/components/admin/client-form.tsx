"use client";

import {
  FormShell,
  SwitchField,
  TextField,
  useRecordForm,
} from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-upload";
import type { DrawerControls } from "@/components/admin/record-list";
import { createClient, updateClient } from "@/lib/admin/actions/clients";

export type ClientRecord = {
  id: string;
  name: string;
  category: string | null;
  logoUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export function ClientForm({
  client,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  client?: ClientRecord;
  nextSortOrder?: number;
} & DrawerControls) {
  const action = client ? updateClient.bind(null, client.id) : createClient;
  const [state, formAction] = useRecordForm(action, onSaved);

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      <TextField
        id="name"
        label="Nama client / instansi"
        required
        defaultValue={client?.name}
        error={state?.fieldErrors?.name}
      />

      <TextField
        id="category"
        label="Kategori client"
        hint="Contoh: Dinas, Sekolah, Kantor, Komunitas."
        defaultValue={client?.category}
        error={state?.fieldErrors?.category}
      />

      <ImageField
        id="logoUrl"
        label="Logo"
        defaultValue={client?.logoUrl}
        folder="client"
        error={state?.fieldErrors?.logoUrl}
      />

      <TextField
        id="sortOrder"
        label="Urutan tampil"
        type="number"
        required
        hint="Angka kecil tampil lebih dulu."
        defaultValue={client?.sortOrder ?? nextSortOrder ?? 0}
        error={state?.fieldErrors?.sortOrder}
      />

      {/*
        Off by default, unlike every other entity. DesignRHF §21 forbids
        publishing a client's name or logo without permission, so this one has
        to be an explicit act rather than the path of least resistance.
      */}
      <SwitchField
        id="isPublished"
        label="Sudah ada izin — tampilkan di website"
        hint="Hanya aktifkan jika client sudah setuju namanya atau logonya ditampilkan. Selama nonaktif, website menampilkan copy umum tanpa menyebut nama."
        defaultChecked={client?.isPublished ?? false}
      />
    </FormShell>
  );
}
