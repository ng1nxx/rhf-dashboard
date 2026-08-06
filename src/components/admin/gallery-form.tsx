"use client";

import {
  FormShell,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  useRecordForm,
} from "@/components/admin/form";
import { ImageField } from "@/components/admin/image-upload";
import type { DrawerControls } from "@/components/admin/record-list";
import {
  createGalleryItem,
  updateGalleryItem,
} from "@/lib/admin/actions/gallery";
import { GALLERY_CATEGORIES } from "@/lib/types";

export type GalleryRecord = {
  id: string;
  title: string | null;
  caption: string | null;
  imageUrl: string | null;
  category: string | null;
  sortOrder: number;
  isPublished: boolean;
};

const CATEGORY_OPTIONS = GALLERY_CATEGORIES.map((value) => ({
  value,
  label: value,
}));

export function GalleryForm({
  item,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  item?: GalleryRecord;
  nextSortOrder?: number;
} & DrawerControls) {
  const action = item
    ? updateGalleryItem.bind(null, item.id)
    : createGalleryItem;
  const [state, formAction] = useRecordForm(action, onSaved);

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      <TextField
        id="title"
        label="Judul"
        defaultValue={item?.title}
        error={state?.fieldErrors?.title}
      />

      <TextAreaField
        id="caption"
        label="Keterangan"
        rows={3}
        defaultValue={item?.caption}
        error={state?.fieldErrors?.caption}
      />

      <ImageField
        id="imageUrl"
        label="Foto"
        // Left empty the public gallery falls back to the branded placeholder
        // rather than showing a broken image.
        hint="Kosongkan untuk memakai gambar sementara berlogo RHF."
        defaultValue={item?.imageUrl}
        folder="galeri"
        error={state?.fieldErrors?.imageUrl}
      />

      <SelectField
        id="category"
        label="Kategori galeri"
        hint="Dipakai untuk filter di halaman galeri."
        defaultValue={item?.category}
        options={CATEGORY_OPTIONS}
        error={state?.fieldErrors?.category}
      />

      <TextField
        id="sortOrder"
        label="Urutan tampil"
        type="number"
        required
        hint="Angka kecil tampil lebih dulu."
        defaultValue={item?.sortOrder ?? nextSortOrder ?? 0}
        error={state?.fieldErrors?.sortOrder}
      />

      <SwitchField
        id="isPublished"
        label="Tampilkan di website"
        defaultChecked={item?.isPublished ?? true}
      />
    </FormShell>
  );
}
