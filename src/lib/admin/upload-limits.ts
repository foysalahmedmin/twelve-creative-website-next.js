/**
 * Largest file the upload endpoint accepts.
 *
 * ⚠️ Must match `MAX_UPLOAD_BYTES` in the backend
 * (twelve-creative-server/src/constants/upload-policy.ts) and stay below
 * nginx's `client_max_body_size`. If this value is higher than the server's,
 * the user waits through a long upload only to be rejected at the end.
 *
 * Used to pre-check a file in the browser so an oversized pick is reported
 * instantly, and to render the limit next to every upload control.
 */
export const MAX_UPLOAD_BYTES = 300 * 1024 * 1024; // 300 MB

export const MAX_UPLOAD_LABEL = "300MB";

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
  }
  if (bytes >= 1024 * 1024) {
    return `${Math.round(bytes / (1024 * 1024))}MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}

/**
 * Returns an error message when the file is too big, or null when it is fine.
 * Naming the actual size makes the limit concrete instead of abstract.
 */
export function checkUploadSize(file: File): string | null {
  if (file.size <= MAX_UPLOAD_BYTES) return null;
  return `This file is ${formatBytes(file.size)}. The maximum is ${MAX_UPLOAD_LABEL} — compress it, or use the URL or YouTube option instead.`;
}
