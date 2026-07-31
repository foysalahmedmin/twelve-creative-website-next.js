"use client";

import { MAX_UPLOAD_LABEL } from "./upload-limits";
import type { UploadedFile } from "./types";

const TOO_LARGE_MESSAGE = `This file is too large to upload (maximum ${MAX_UPLOAD_LABEL}). Compress it, or use the URL or YouTube option instead.`;

export async function uploadAdminFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch("/api/admin-upload", {
    method: "POST",
    body: form,
  });

  // nginx rejects anything over client_max_body_size before the request ever
  // reaches the app, and answers with an HTML error page rather than JSON.
  // Without this branch the user sees "invalid server response" and assumes
  // the system is broken, when the file was simply too large.
  if (res.status === 413) throw new Error(TOO_LARGE_MESSAGE);

  const json = (await res.json().catch(() => null)) as
    | { success: true; data: UploadedFile }
    | { success: false; message?: string }
    | null;

  if (!json) throw new Error("Upload failed: invalid server response");
  if (!res.ok || json.success === false) {
    const message = (json as { message?: string }).message;
    // Multer's own wording is terse and never states the limit.
    if (message === "File too large") throw new Error(TOO_LARGE_MESSAGE);
    throw new Error(message || "Upload failed");
  }
  return json.data;
}
