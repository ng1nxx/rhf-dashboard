"use client";

import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestUploadSignature } from "@/lib/admin/actions/uploads";
import { assertUploadAllowed, UPLOAD_LIMITS } from "@/lib/storage/adapter";
import type { UploadFolder } from "@/lib/storage/cloudinary";

/**
 * Image fields backed by Cloudinary — PRD §12.3, §12.5–12.7.
 *
 * The file never touches our server. Picking a file asks a server action for a
 * signature, then posts the file straight to Cloudinary from the browser; only
 * the resulting URL comes back into the form, in a hidden input, so the schema
 * and the columns behind it stay exactly as they were.
 *
 * The URL box stays visible and editable. Uploading is the common path, but
 * pasting a link that already exists somewhere else should not require
 * re-uploading it.
 */

const ACCEPT = UPLOAD_LIMITS.allowedMimeTypes.join(",");

async function uploadToCloudinary(
  file: File,
  folder: UploadFolder,
): Promise<string> {
  // Checked here so the person is told in Indonesian before a slow upload
  // starts. Cloudinary enforces its own account limits regardless; this is
  // about feedback, not about being the only gate.
  assertUploadAllowed(file);

  const signed = await requestUploadSignature(folder);

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signed.apiKey);
  body.append("timestamp", String(signed.timestamp));
  body.append("folder", signed.folder);
  body.append("signature", signed.signature);

  const response = await fetch(signed.uploadUrl, { method: "POST", body });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message ?? "Unggahan ditolak Cloudinary.");
  }

  return result.secure_url as string;
}

function pesan(cause: unknown): string {
  return cause instanceof Error ? cause.message : "Gagal mengunggah gambar.";
}

/** A framed thumbnail of whatever URL is currently held. */
function Preview({ url, alt }: { url: string; alt: string }) {
  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-rhf-border bg-white">
      <Image
        src={url}
        alt={alt}
        fill
        sizes="80px"
        className="object-cover"
        // Admin previews are not worth a cache entry each; the panel shows a
        // handful at a time and they change constantly.
        unoptimized
      />
    </div>
  );
}

export function ImageField({
  id,
  label,
  hint,
  error,
  defaultValue,
  folder,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  defaultValue?: string | null;
  folder: UploadFolder;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;

    setBusy(true);
    setUploadError(null);

    try {
      setUrl(await uploadToCloudinary(file, folder));
    } catch (cause) {
      setUploadError(pesan(cause));
    } finally {
      setBusy(false);
      // Cleared so choosing the same file twice in a row still fires onChange.
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-rhf-charcoal">
        {label}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          opsional
        </span>
      </label>

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      <div className="flex items-start gap-3 rounded-lg border border-rhf-border bg-white p-3">
        {url ? (
          <Preview url={url} alt={`Pratinjau ${label}`} />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-rhf-border bg-rhf-cream/60">
            <ImagePlus aria-hidden className="size-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="rhfOutline"
              size="sm"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              {busy ? (
                <Loader2 aria-hidden className="animate-spin" />
              ) : (
                <Upload aria-hidden />
              )}
              {busy ? "Mengunggah…" : url ? "Ganti foto" : "Pilih foto"}
            </Button>

            {url && !busy ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setUrl("")}
              >
                <Trash2 aria-hidden />
                Hapus
              </Button>
            ) : null}
          </div>

          <input
            id={inputId}
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(event) => pick(event.target.files?.[0])}
          />

          {/* The stored value. Still editable so an existing link can be
              pasted without uploading it again. */}
          <Input
            name={id}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://… atau unggah lewat tombol di atas"
            className="h-9 font-mono text-xs"
            aria-label={`URL ${label}`}
          />
        </div>
      </div>

      {uploadError ? (
        <p role="alert" className="text-sm text-destructive">
          {uploadError}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Several images for one record — the package's extra photos.
 *
 * Submits as newline-separated URLs in a hidden textarea, which is what
 * `linesToArray` in the schema already expects, so nothing server-side knows
 * this stopped being a textarea the person typed into.
 */
export function MultiImageField({
  id,
  label,
  hint,
  error,
  defaultValue = [],
  folder,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  defaultValue?: string[];
  folder: UploadFolder;
}) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function pick(files: FileList | null) {
    if (!files?.length) return;

    setUploadError(null);
    setBusy(files.length);

    // Sequential rather than parallel: each upload asks for its own signature,
    // and a phone on mobile data uploading six 5 MB photos at once tends to
    // stall all six rather than finish any.
    for (const file of Array.from(files)) {
      try {
        const uploaded = await uploadToCloudinary(file, folder);
        setUrls((current) => [...current, uploaded]);
      } catch (cause) {
        setUploadError(`${file.name}: ${pesan(cause)}`);
      } finally {
        setBusy((n) => n - 1);
      }
    }

    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-rhf-charcoal">
        {label}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          opsional
        </span>
      </label>

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}

      <div className="flex flex-col gap-3 rounded-lg border border-rhf-border bg-white p-3">
        {urls.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {urls.map((url, index) => (
              <li key={url} className="relative">
                <Preview url={url} alt={`Foto ${index + 1}`} />
                <button
                  type="button"
                  onClick={() =>
                    setUrls((current) => current.filter((u) => u !== url))
                  }
                  aria-label={`Hapus foto ${index + 1}`}
                  className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive p-1 text-white shadow-sm"
                >
                  <Trash2 aria-hidden className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">Belum ada foto tambahan.</p>
        )}

        <div>
          <Button
            type="button"
            variant="rhfOutline"
            size="sm"
            disabled={busy > 0}
            onClick={() => fileRef.current?.click()}
          >
            {busy > 0 ? (
              <Loader2 aria-hidden className="animate-spin" />
            ) : (
              <Upload aria-hidden />
            )}
            {busy > 0 ? `Mengunggah ${busy} foto…` : "Tambah foto"}
          </Button>
        </div>

        <input
          id={inputId}
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(event) => pick(event.target.files)}
        />
      </div>

      <textarea name={id} value={urls.join("\n")} readOnly hidden />

      {uploadError ? (
        <p role="alert" className="text-sm text-destructive">
          {uploadError}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
