"use server";

import { verifySession } from "@/lib/auth/dal";
import {
  createSignedUpload,
  UPLOAD_FOLDERS,
  type SignedUpload,
  type UploadFolder,
} from "@/lib/storage/cloudinary";

/**
 * Hands the browser permission to upload one image.
 *
 * This is the security boundary for uploads. A signature is a bearer token for
 * writing into the Cloudinary account, so it is issued only to a logged-in
 * session — `verifySession()` here is not a formality, it is the whole control.
 * Nothing about the file is trusted: the folder is chosen from a fixed list,
 * never from the caller.
 */
export async function requestUploadSignature(
  folder: UploadFolder,
): Promise<SignedUpload> {
  await verifySession();

  if (!(folder in UPLOAD_FOLDERS)) {
    throw new Error("Folder unggahan tidak dikenal.");
  }

  return createSignedUpload(folder);
}
