"use client";

import { useState } from "react";

import {
  FormShell,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  useRecordForm,
} from "@/components/admin/form";
import type { DrawerControls } from "@/components/admin/record-list";
import { createCategory, updateCategory } from "@/lib/admin/actions/categories";
import { CATEGORY_ICON_KEYS, slugify } from "@/lib/admin/schemas";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
};

const ICON_OPTIONS = CATEGORY_ICON_KEYS.map((key) => ({
  value: key,
  label: key,
}));

export function CategoryForm({
  category,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  category?: CategoryRecord;
  nextSortOrder?: number;
} & DrawerControls) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;
  const [state, formAction] = useRecordForm(action, onSaved);

  // PRD §12.3 wants the slug auto-generated but still editable. It is only
  // derived while creating: changing the slug of a live category would break
  // every /menu?kategori=... link already shared.
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      <TextField
        id="name"
        label="Nama kategori"
        required
        defaultValue={category?.name}
        error={state?.fieldErrors?.name}
        onChange={(event) => {
          if (!slugTouched) setSlug(slugify(event.target.value));
        }}
      />

      <TextField
        id="slug"
        label="Slug"
        required
        hint="Dipakai di URL, contoh /menu?kategori=snack-box. Huruf kecil, angka, dan tanda hubung."
        value={slug}
        onChange={(event) => {
          setSlugTouched(true);
          setSlug(event.target.value);
        }}
        error={state?.fieldErrors?.slug}
      />

      <TextAreaField
        id="description"
        label="Deskripsi"
        rows={3}
        defaultValue={category?.description}
        error={state?.fieldErrors?.description}
      />

      <SelectField
        id="icon"
        label="Ikon"
        hint="Ditampilkan di kartu layanan. Kosongkan untuk memakai ikon bawaan."
        defaultValue={category?.icon}
        options={ICON_OPTIONS}
        error={state?.fieldErrors?.icon}
      />

      <TextField
        id="sortOrder"
        label="Urutan tampil"
        type="number"
        required
        hint="Angka kecil tampil lebih dulu."
        defaultValue={category?.sortOrder ?? nextSortOrder ?? 0}
        error={state?.fieldErrors?.sortOrder}
      />

      <SwitchField
        id="isPublished"
        label="Tampilkan di website"
        hint="Kategori nonaktif tidak muncul di filter katalog maupun halaman layanan."
        defaultChecked={category?.isPublished ?? true}
      />
    </FormShell>
  );
}
