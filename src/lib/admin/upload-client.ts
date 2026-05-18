"use client";

import type { UploadedFile } from "./types";

export async function uploadAdminFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch("/api/admin-upload", {
    method: "POST",
    body: form,
  });

  const json = (await res.json().catch(() => null)) as
    | { success: true; data: UploadedFile }
    | { success: false; message?: string }
    | null;

  if (!json) throw new Error("Upload failed: invalid server response");
  if (!res.ok || json.success === false) {
    throw new Error((json as { message?: string }).message || "Upload failed");
  }
  return json.data;
}
