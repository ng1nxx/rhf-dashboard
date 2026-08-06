"use client";

import { useState } from "react";

import {
  CheckboxGroupField,
  FormSection,
  FormShell,
  PriceField,
  SwitchField,
  TextAreaField,
  TextField,
  useRecordForm,
} from "@/components/admin/form";
import { ImageField, MultiImageField } from "@/components/admin/image-upload";
import type { DrawerControls } from "@/components/admin/record-list";
import { createMenuItem, updateMenuItem } from "@/lib/admin/actions/menu-items";
import { slugify } from "@/lib/admin/schemas";
import { EXCERPT_MAX_CHARS, excerpt, priceLabel, PRICE_UNITS } from "@/lib/menu-text";

/**
 * The menu package form — PRD §12.3.
 *
 * Shared by the create and edit paths of the drawer. Everything is
 * uncontrolled except the description, which is mirrored into state only to
 * show the person which part of it the catalogue card will use.
 */

export type MenuItemRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | null;
  priceUnit: string | null;
  minOrder: string | null;
  packageItems: string[];
  suitableFor: string | null;
  imageUrl: string | null;
  galleryImages: string[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryIds: string[];
};

export type CategoryOption = {
  id: string;
  name: string;
  isPublished: boolean;
};

export function MenuItemForm({
  item,
  categories,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  item?: MenuItemRecord;
  /** Every category, published or not — a package may be prepared in advance. */
  categories: CategoryOption[];
  nextSortOrder?: number;
} & DrawerControls) {
  const action = item ? updateMenuItem.bind(null, item.id) : createMenuItem;
  const [state, formAction] = useRecordForm(action, onSaved);

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");

  const cardText = excerpt(description);
  const remaining = description.trim().length - cardText.length;

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    // A hidden category can still be assigned — the package simply will not
    // appear under it until the category is published — so say so rather than
    // leaving the person to wonder why nothing shows up.
    label: category.isPublished
      ? category.name
      : `${category.name} (disembunyikan)`,
  }));

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      <FormSection title="Dasar">
        <TextField
          id="name"
          label="Nama paket"
          required
          defaultValue={item?.name}
          error={state?.fieldErrors?.name}
          onChange={(event) => setName(event.target.value)}
        />

        {/*
          The slug is not a field. On create the server derives it from the
          name and disambiguates collisions; on update it is not in the schema
          at all, so an address already shared over WhatsApp cannot move.
        */}
        <p className="-mt-2 text-xs text-muted-foreground">
          Alamat halaman:{" "}
          <span className="font-mono text-rhf-charcoal">
            /menu/{item ? item.slug : slugify(name) || "…"}
          </span>
          {item ? (
            <span className="ml-1.5">
              — dikunci, tautan yang sudah disebar tetap hidup meski nama diubah.
            </span>
          ) : (
            <span className="ml-1.5">— dibuat otomatis dari nama.</span>
          )}
        </p>

        <div>
          <TextAreaField
            id="description"
            label="Deskripsi"
            required
            rows={7}
            // Not "the first sentence": the excerpt takes as many whole
            // sentences as fit, so a short opener brings the next one with it.
            // The preview below shows the actual result, which is the honest
            // version of this instruction.
            hint={`Bagian awal tampil di kartu katalog — kalimat utuh sampai sekitar ${EXCERPT_MAX_CHARS} karakter. Selebihnya tampil di halaman detail.`}
            defaultValue={item?.description}
            error={state?.fieldErrors?.description}
            onChange={(event) => setDescription(event.target.value)}
          />

          {/*
            Which sentence lands on the card is the one thing about this field
            that is not obvious from typing in it, so it is shown rather than
            explained.
          */}
          {description.trim() ? (
            <div className="mt-2 rounded-lg border border-rhf-border bg-rhf-cream/60 p-3">
              <p className="text-xs font-semibold tracking-wide text-rhf-brown uppercase">
                Yang tampil di kartu katalog
              </p>
              <p className="mt-1 text-sm text-rhf-charcoal">{cardText}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {cardText.length}/{EXCERPT_MAX_CHARS} karakter
                {remaining > 0
                  ? ` — sisanya (${remaining} karakter) tampil di halaman detail.`
                  : " — deskripsi ini seluruhnya muat di kartu."}
              </p>
            </div>
          ) : null}
        </div>

        <CheckboxGroupField
          id="categoryIds"
          label="Kategori"
          required
          hint="Satu paket boleh masuk beberapa kategori sekaligus — nasi box juga bisa jadi paket rapat dan paket sekolah."
          defaultValue={item?.categoryIds}
          options={categoryOptions}
          error={state?.fieldErrors?.categoryIds}
        />
      </FormSection>

      <FormSection title="Harga">
        <PriceField
          price={item?.price}
          unit={item?.priceUnit}
          units={PRICE_UNITS}
          preview={priceLabel}
          priceError={state?.fieldErrors?.price}
          unitError={state?.fieldErrors?.priceUnit}
        />

        <TextField
          id="minOrder"
          label="Minimal order"
          hint='Contoh "Minimal 20 box".'
          defaultValue={item?.minOrder}
          error={state?.fieldErrors?.minOrder}
        />
      </FormSection>

      <FormSection title="Isi paket">
        <TextAreaField
          id="packageItems"
          label="Isi paket"
          rows={6}
          hint="Satu baris satu item. Ditampilkan sebagai daftar bertanda di halaman detail."
          defaultValue={item?.packageItems.join("\n")}
          error={state?.fieldErrors?.packageItems}
        />

        <TextAreaField
          id="suitableFor"
          label="Cocok untuk"
          rows={3}
          hint="Acara apa saja yang pas dengan paket ini."
          defaultValue={item?.suitableFor}
          error={state?.fieldErrors?.suitableFor}
        />
      </FormSection>

      <FormSection title="Foto">
        <ImageField
          id="imageUrl"
          label="Foto utama"
          hint="Tampil di kartu katalog dan di bagian atas halaman detail."
          defaultValue={item?.imageUrl}
          folder="menu"
          error={state?.fieldErrors?.imageUrl}
        />

        <MultiImageField
          id="galleryImages"
          label="Foto tambahan"
          hint="Boleh pilih beberapa sekaligus. Tampil di halaman detail paket."
          defaultValue={item?.galleryImages}
          folder="menu"
          error={state?.fieldErrors?.galleryImages}
        />
      </FormSection>

      <FormSection title="Tampilan">
        <TextAreaField
          id="tags"
          label="Tag"
          rows={3}
          hint='Satu baris satu tag, tampil sebagai badge di kartu — contoh "Best Seller".'
          defaultValue={item?.tags.join("\n")}
          error={state?.fieldErrors?.tags}
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
          id="isFeatured"
          label="Paket unggulan"
          hint="Paket unggulan tampil di beranda."
          defaultChecked={item?.isFeatured ?? false}
        />

        <SwitchField
          id="isPublished"
          label="Tampilkan di website"
          hint="Matikan untuk menyembunyikan paket tanpa menghapus datanya."
          defaultChecked={item?.isPublished ?? true}
        />
      </FormSection>

      <FormSection
        title="SEO"
        description="Boleh dikosongkan — kalau kosong, nama dan pembuka deskripsi paket yang dipakai."
      >
        <TextField
          id="seoTitle"
          label="SEO title"
          defaultValue={item?.seoTitle}
          error={state?.fieldErrors?.seoTitle}
        />

        <TextAreaField
          id="seoDescription"
          label="SEO description"
          rows={3}
          hint="Sekitar 150–160 karakter, inilah yang terbaca di hasil pencarian Google."
          defaultValue={item?.seoDescription}
          error={state?.fieldErrors?.seoDescription}
        />
      </FormSection>
    </FormShell>
  );
}
