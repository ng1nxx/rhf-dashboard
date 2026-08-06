"use client";

import {
  FormShell,
  SwitchField,
  TextAreaField,
  TextField,
  useRecordForm,
} from "@/components/admin/form";
import type { DrawerControls } from "@/components/admin/record-list";
import { createFaq, updateFaq } from "@/lib/admin/actions/faq";

export type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
};

/**
 * Create and edit share one form — the fields are identical, and keeping them
 * in one place means a field added later cannot appear on only one of them.
 */
export function FaqForm({
  faq,
  nextSortOrder,
  onCancel,
  onSaved,
}: {
  faq?: FaqRecord;
  /** Where a new entry lands: after the current last one. */
  nextSortOrder?: number;
} & DrawerControls) {
  const action = faq ? updateFaq.bind(null, faq.id) : createFaq;
  const [state, formAction] = useRecordForm(action, onSaved);

  return (
    <FormShell action={formAction} state={state} onCancel={onCancel}>
      <TextField
        id="question"
        label="Pertanyaan"
        required
        defaultValue={faq?.question}
        error={state?.fieldErrors?.question}
      />

      <TextAreaField
        id="answer"
        label="Jawaban"
        required
        rows={5}
        defaultValue={faq?.answer}
        error={state?.fieldErrors?.answer}
      />

      <TextField
        id="sortOrder"
        label="Urutan tampil"
        type="number"
        required
        hint="Angka kecil tampil lebih dulu."
        defaultValue={faq?.sortOrder ?? nextSortOrder ?? 0}
        error={state?.fieldErrors?.sortOrder}
      />

      <SwitchField
        id="isPublished"
        label="Tampilkan di website"
        hint="FAQ yang aktif muncul di halaman Kontak."
        defaultChecked={faq?.isPublished ?? true}
      />
    </FormShell>
  );
}
