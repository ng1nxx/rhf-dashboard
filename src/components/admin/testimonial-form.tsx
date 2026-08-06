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
  createTestimonial,
  updateTestimonial,
} from "@/lib/admin/actions/testimonials";

export type TestimonialRecord = {
  id: string;
  customerName: string;
  customerType: string | null;
  message: string;
  rating: number | null;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n} bintang`,
}));

export function TestimonialForm({
  testimonial,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  testimonial?: TestimonialRecord;
  nextSortOrder?: number;
} & DrawerControls) {
  const action = testimonial
    ? updateTestimonial.bind(null, testimonial.id)
    : createTestimonial;
  const [state, formAction] = useRecordForm(action, onSaved);

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      {/* PRELAUNCH.md flags the seeded testimonials as placeholders, so the
          reminder sits where someone is about to add or edit one. */}
      <p className="rounded-lg border border-rhf-border bg-rhf-cream px-3.5 py-2.5 text-sm text-rhf-brown">
        Tulis hanya testimoni asli yang sudah diizinkan pelanggan untuk
        ditampilkan.
      </p>

      <TextField
        id="customerName"
        label="Nama pelanggan"
        required
        defaultValue={testimonial?.customerName}
        error={state?.fieldErrors?.customerName}
      />

      <TextField
        id="customerType"
        label="Tipe pelanggan"
        hint="Contoh: Kantor, Sekolah, Dinas, Keluarga."
        defaultValue={testimonial?.customerType}
        error={state?.fieldErrors?.customerType}
      />

      <TextAreaField
        id="message"
        label="Isi testimoni"
        required
        rows={5}
        defaultValue={testimonial?.message}
        error={state?.fieldErrors?.message}
      />

      <SelectField
        id="rating"
        label="Rating"
        defaultValue={testimonial?.rating ? String(testimonial.rating) : null}
        options={RATING_OPTIONS}
        error={state?.fieldErrors?.rating}
      />

      <ImageField
        id="imageUrl"
        label="Foto pelanggan"
        defaultValue={testimonial?.imageUrl}
        folder="testimoni"
        error={state?.fieldErrors?.imageUrl}
      />

      <TextField
        id="sortOrder"
        label="Urutan tampil"
        type="number"
        required
        hint="Angka kecil tampil lebih dulu."
        defaultValue={testimonial?.sortOrder ?? nextSortOrder ?? 0}
        error={state?.fieldErrors?.sortOrder}
      />

      <SwitchField
        id="isPublished"
        label="Tampilkan di website"
        defaultChecked={testimonial?.isPublished ?? true}
      />
    </FormShell>
  );
}
