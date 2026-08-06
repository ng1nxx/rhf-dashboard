"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Cell } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Publish toggle — PRD §15.3, and the acceptance criterion in §12.3 that an
 * item can be taken off the website without being deleted.
 *
 * `useTransition` keeps the row responsive while the server action runs and
 * the public pages rebuild, which is not instant.
 */
export function PublishToggle({
  isPublished,
  action,
}: {
  isPublished: boolean;
  action: () => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => action())}
      aria-label={
        isPublished ? "Sembunyikan dari website" : "Tampilkan di website"
      }
      title={isPublished ? "Sembunyikan dari website" : "Tampilkan di website"}
    >
      {isPublished ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
    </Button>
  );
}

/**
 * Opens the drawer on this row.
 *
 * Names the record in its label rather than saying "Ubah": with several rows
 * on screen and nothing but a pencil to look at, a screen reader otherwise
 * announces the same word for every row.
 */
export function EditButton({
  recordName,
  onClick,
}: {
  recordName: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-label={`Ubah ${recordName}`}
      title="Ubah"
    >
      <Pencil aria-hidden />
    </Button>
  );
}

/**
 * The last cell of every admin row: hide, edit, delete — in that order.
 *
 * Assembled once rather than per table. The order is deliberate and the
 * destructive one is last, so the pencil is never where a habit-formed click
 * lands on delete.
 */
export function RowActions({
  recordName,
  isPublished,
  togglePublish,
  onEdit,
  remove,
  deleteWarning,
}: {
  recordName: string;
  isPublished: boolean;
  togglePublish: () => Promise<void>;
  onEdit: () => void;
  remove: () => Promise<void>;
  /** Extra consequence worth stating in the confirmation. */
  deleteWarning?: string;
}) {
  return (
    <Cell>
      <div className="flex items-center gap-0.5">
        <PublishToggle isPublished={isPublished} action={togglePublish} />
        <EditButton recordName={recordName} onClick={onEdit} />
        <DeleteButton
          recordName={recordName}
          warning={deleteWarning}
          action={remove}
        />
      </div>
    </Cell>
  );
}

/**
 * Delete, behind a confirmation.
 *
 * Deleting is the one irreversible action in the panel — there is no trash and
 * no undo — so it asks first, and the dialog names the record rather than
 * saying "this item", so a misclick on the wrong row is visible before it is
 * confirmed.
 */
export function DeleteButton({
  recordName,
  warning,
  action,
}: {
  recordName: string;
  /** Extra consequence worth stating, e.g. how many packages lose a category. */
  warning?: string;
  action: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Hapus ${recordName}`}
        title="Hapus"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 aria-hidden />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus data ini?</DialogTitle>
            <DialogDescription>
              <span className="font-semibold text-rhf-charcoal">
                {recordName}
              </span>{" "}
              akan dihapus permanen dan tidak bisa dikembalikan.
              {warning ? ` ${warning}` : ""}
              {" "}Kalau hanya ingin menyembunyikannya dari website, pakai
              tombol mata.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="rhfOutline"
              size="rhf"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Batal
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="rhf"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await action();
                  setOpen(false);
                })
              }
            >
              {pending ? "Menghapus…" : "Ya, hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
