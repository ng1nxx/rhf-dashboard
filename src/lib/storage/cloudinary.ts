import "server-only";

import { createHash } from "node:crypto";

/**
 * Cloudinary signed direct upload — PRD §16.2.
 *
 * The browser sends the file straight to Cloudinary; this module only issues a
 * short-lived signature authorising it. The obvious alternative — posting the
 * file to a server action which forwards it — cannot work in production:
 * Next caps a server action body at 1 MB by default, and Vercel caps a
 * function request body at 4.5 MB with no way to raise it. Photos taken on a
 * phone are 3–8 MB, so the files the owner actually wants to upload are
 * exactly the ones that route rejects. Going direct also halves the bandwidth
 * and never occupies a function for the length of an upload.
 *
 * No `cloudinary` SDK. A signed upload needs one SHA-1 and one POST, and the
 * POST happens in the browser; the SDK would be a dependency carried for a
 * hash Node already computes.
 */

export const UPLOAD_FOLDERS = {
  menu: "rhf/menu",
  galeri: "rhf/galeri",
  testimoni: "rhf/testimoni",
  client: "rhf/client",
} as const;

export type UploadFolder = keyof typeof UPLOAD_FOLDERS;

export type SignedUpload = {
  uploadUrl: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    // Loud and specific: a missing key here surfaces as an opaque 401 from
    // Cloudinary halfway through an upload otherwise.
    throw new Error(
      `${name} belum diset. Isi kredensial Cloudinary di .env.local.`,
    );
  }

  return value;
}

/**
 * Signs one upload into one of the fixed folders.
 *
 * The folder comes from `UPLOAD_FOLDERS` rather than from the caller: the
 * signature authorises whatever is signed, so a caller-supplied path would let
 * anything that can reach the action write anywhere in the account.
 */
export function createSignedUpload(folder: UploadFolder): SignedUpload {
  const cloudName = required("CLOUDINARY_CLOUD_NAME");
  const apiKey = required("CLOUDINARY_API_KEY");
  const apiSecret = required("CLOUDINARY_API_SECRET");

  const target = UPLOAD_FOLDERS[folder];
  const timestamp = Math.floor(Date.now() / 1000);

  // Every signed parameter must also be sent with the upload, and every
  // parameter sent — except file, api_key, cloud_name, and resource_type —
  // must be signed. Sorted alphabetically, joined with &, secret appended.
  const params: Record<string, string> = {
    folder: target,
    timestamp: String(timestamp),
  };

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    apiKey,
    timestamp,
    folder: target,
    signature,
  };
}
