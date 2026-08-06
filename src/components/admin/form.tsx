"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { FormState } from "@/lib/admin/crud";

/**
 * Building blocks for the admin forms — PRD §15.3.
 *
 * Field errors arrive from the server action's `FormState`. The inputs are
 * uncontrolled and seeded with `defaultValue`, so a rejected submission comes
 * back with what the person typed still in place rather than an emptied form.
 */

/**
 * Wires a form to its server action and tells the drawer when to close.
 *
 * Every form lives in a drawer now, and nothing navigates away from one, so a
 * form cannot learn that its write went through by simply being unmounted. It
 * has to be told: `runMutation` returns `{ ok: true }` only after the
 * transaction commits, and that is the signal acted on here.
 *
 * Watching `state` rather than the submit handler matters — a submission that
 * comes back with field errors must leave the drawer open, with the typed
 * values still in it.
 */
export function useRecordForm(
  action: (state: FormState, formData: FormData) => Promise<FormState>,
  onSaved: () => void,
): [FormState, (formData: FormData) => void] {
  const [state, formAction] = useActionState<FormState, FormData>(
    action,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) onSaved();
  }, [state, onSaved]);

  return [state, formAction];
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-rhf-charcoal">
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            opsional
          </span>
        )}
      </label>

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  defaultValue,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** `null` allowed so a Prisma row can be handed straight in. */
  defaultValue?: string | number | null;
  type?: string;
  // The explicitly declared props are omitted from the passthrough, otherwise
  // TypeScript intersects them with Input's stricter versions and `null` stops
  // being assignable.
} & Omit<
  React.ComponentProps<typeof Input>,
  "id" | "name" | "type" | "defaultValue" | "required"
>) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue ?? undefined}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11"
        {...rest}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  error,
  required,
  defaultValue,
  rows = 4,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string | null;
  rows?: number;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <Textarea
        id={id}
        name={id}
        rows={rows}
        defaultValue={defaultValue ?? undefined}
        required={required}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  defaultValue,
  options,
  placeholder = "— tidak dipilih —",
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string | null;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      {/*
        A native <select> rather than the shadcn one: shadcn's Select renders a
        listbox that does not submit with the form, which would need a hidden
        input to work here. Native also gets the platform picker on a phone.
      */}
      <select
        id={id}
        name={id}
        defaultValue={defaultValue ?? ""}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full rounded-lg border border-input bg-white px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
      >
        {!required ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/**
 * A list of checkboxes that all submit under one name — used for a package's
 * categories (PRD §12.3, §8.2).
 *
 * Replaces a `<select multiple>`, which needed Ctrl/Cmd-click to pick a second
 * option: an interaction nothing on screen can teach, where plain-clicking
 * replaces the selection instead of adding to it. Every option is visible and
 * every one is a plain tap.
 *
 * No `required` attribute: on checkboxes it would mean *each* box must be
 * ticked. The "at least one" rule lives in the schema, which is where it has
 * to be anyway.
 */
export function CheckboxGroupField({
  id,
  label,
  hint,
  error,
  required,
  defaultValue = [],
  options,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  defaultValue?: string[];
  options: readonly { value: string; label: string }[];
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      {/* No `aria-invalid` here: it is not a supported attribute on a group,
          and the error is announced through `aria-describedby` instead. */}
      <div
        id={id}
        role="group"
        aria-describedby={error ? `${id}-error` : undefined}
        className={`grid gap-1 rounded-lg border bg-white p-2 sm:grid-cols-2 ${
          error ? "border-destructive" : "border-input"
        }`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-rhf-cream/60"
          >
            <input
              type="checkbox"
              name={id}
              value={option.value}
              defaultChecked={defaultValue.includes(option.value)}
              className="size-4.5 shrink-0 accent-rhf-orange"
            />
            <span className="min-w-0">{option.label}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  );
}

/**
 * Price and its unit, side by side, with a live preview of the sentence the
 * customer will actually read.
 *
 * The label is no longer a field anyone types — it is built from these two in
 * `lib/menu-text.ts`. The preview exists so that derivation is not invisible:
 * without it, someone entering 15000 has no way to know whether the website
 * will say "Rp15000" or "Mulai Rp15.000/box", and clearing the price to mean
 * "quote only" looks like leaving the form incomplete.
 */
export function PriceField({
  price,
  unit,
  units,
  priceError,
  unitError,
  preview,
}: {
  price?: number | null;
  unit?: string | null;
  units: readonly string[];
  priceError?: string;
  unitError?: string;
  /** Given the current pair, returns the customer-facing string. */
  preview: (price: number | null, unit: string | null) => string;
}) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(
    price ?? null,
  );
  const [currentUnit, setCurrentUnit] = useState<string | null>(
    unit ?? null,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-rhf-charcoal">
        Harga
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          kosongkan kalau harganya menyesuaikan permintaan
        </span>
      </span>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            Rp
          </span>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            defaultValue={price ?? undefined}
            onChange={(event) =>
              setCurrentPrice(
                event.target.value === "" ? null : Number(event.target.value),
              )
            }
            aria-label="Harga"
            aria-invalid={priceError ? true : undefined}
            className="h-11 pl-9"
          />
        </div>

        <select
          id="priceUnit"
          name="priceUnit"
          defaultValue={unit ?? ""}
          onChange={(event) => setCurrentUnit(event.target.value || null)}
          aria-label="Satuan harga"
          aria-invalid={unitError ? true : undefined}
          className="h-11 rounded-lg border border-input bg-white px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-32 md:text-sm"
        >
          <option value="">— satuan —</option>
          {units.map((value) => (
            <option key={value} value={value}>
              per {value}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-muted-foreground">
        Tampil di website sebagai{" "}
        <span className="font-semibold text-rhf-deep-orange">
          {preview(currentPrice, currentUnit)}
        </span>
      </p>

      {priceError ?? unitError ? (
        <p role="alert" className="text-sm text-destructive">
          {priceError ?? unitError}
        </p>
      ) : null}
    </div>
  );
}

// The image fields moved to `components/admin/image-upload.tsx` once they
// gained an uploader — they need client state and a server action, which the
// plain building blocks here deliberately do not.

/**
 * A titled break between groups of fields.
 *
 * The menu form has sixteen fields — roughly three times any form in stage 4a —
 * and an unbroken column of them is hard to scan for the one you came to
 * change.
 */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-5 border-t border-rhf-border pt-5 first:border-t-0 first:pt-0">
      <legend className="sr-only">{title}</legend>

      <div>
        <h2 className="font-heading text-sm font-bold tracking-wide text-rhf-brown uppercase">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {children}
    </fieldset>
  );
}

/**
 * A toggle for a state that is on or off — "live on the website", "featured".
 *
 * A checkbox reads as "tick this to include it in what you are submitting"; a
 * switch reads as the state of the thing itself, which is what these two
 * actually are. Radix keeps the keyboard and screen-reader behaviour of a
 * checkbox underneath, and submits under the same name, so nothing downstream
 * changes.
 */
export function SwitchField({
  id,
  label,
  hint,
  defaultChecked,
}: {
  id: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-rhf-border bg-rhf-cream/50 p-3.5">
      <Switch id={id} name={id} defaultChecked={defaultChecked} className="mt-0.5" />

      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-semibold text-rhf-charcoal">
          {label}
        </label>
        {hint ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function SubmitButton() {
  // Reads the pending state of the enclosing <form>, so the button knows about
  // the submission without the parent threading it down.
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="rhf" size="rhfLg" disabled={pending}>
      {pending ? "Menyimpan…" : "Simpan"}
    </Button>
  );
}

/**
 * Wraps a form: the error summary, the submit button, and a way back out.
 *
 * The way out is a button rather than a link, because every form lives in a
 * drawer and nothing navigates: cancelling closes the panel and leaves the
 * person exactly where they were in the list.
 */
export function FormShell({
  action,
  state,
  onCancel,
  children,
}: {
  action: (formData: FormData) => void;
  state: FormState;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-5">
      {children}

      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-1 flex flex-wrap gap-3 border-t border-rhf-border bg-rhf-cream/95 px-1 py-3 backdrop-blur">
        <SubmitButton />

        <Button
          type="button"
          variant="rhfOutline"
          size="rhfLg"
          onClick={onCancel}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
