/**
 * Image storage seam — PRD §16.2.
 *
 * Cloudinary is the chosen provider, but the admin panel's uploader (round 2)
 * should depend on this interface rather than on Cloudinary directly, so the
 * provider can change without touching UI code.
 *
 * No implementation ships in round 1: nothing uploads yet, and shipping an
 * untested Cloudinary client would be dead weight.
 */

export type UploadedAsset = {
  /** Public URL to store on the record's `imageUrl`. */
  url: string;
  /** Provider-side identifier, needed to delete the asset later. */
  key: string;
  width?: number;
  height?: number;
};

export type StorageAdapter = {
  /**
   * Uploads a file and returns its public URL.
   *
   * Implementations must enforce the limits in PRD §21: accept images only,
   * and cap file size. Validate on the server — a client-side `accept`
   * attribute is a hint, not a control.
   */
  upload(file: File, options?: { folder?: string }): Promise<UploadedAsset>;

  /** Removes a previously uploaded asset by its provider key. */
  remove(key: string): Promise<void>;
};

/** Upload constraints — enforce these server-side (PRD §21). */
export const UPLOAD_LIMITS = {
  maxBytes: 5 * 1024 * 1024,
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ] as const,
};

export function assertUploadAllowed(file: File): void {
  if (file.size > UPLOAD_LIMITS.maxBytes) {
    throw new Error("Ukuran file melebihi 5 MB.");
  }

  const allowed = UPLOAD_LIMITS.allowedMimeTypes as readonly string[];
  if (!allowed.includes(file.type)) {
    throw new Error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
  }
}
