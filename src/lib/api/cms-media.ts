import type { VideoRef, VideoSource } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

export type CmsImageMedia = {
  type: "image";
  image: string;
};

export type CmsVideoMedia = {
  type: "video";
  video: VideoRef;
  thumbnail?: string;
};

export type CmsMedia = CmsImageMedia | CmsVideoMedia;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

function hasUnsafeCharacters(value: string): boolean {
  return /[\u0000-\u001F\u007F\\]/.test(value);
}

export function isSafeRootRelativePath(
  value: string,
  uploadsOnly = false,
): boolean {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (hasUnsafeCharacters(value)) return false;

  const pathname = value.split(/[?#]/, 1)[0];
  try {
    const decoded = decodeURIComponent(pathname);
    if (decoded.split("/").includes("..")) return false;
    return (
      !uploadsOnly || decoded === "/uploads" || decoded.startsWith("/uploads/")
    );
  } catch {
    return false;
  }
}

export function isSafeHttpUrl(value: string): boolean {
  if (hasUnsafeCharacters(value)) return false;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function isSafeHttpsUrl(value: string): boolean {
  if (!isSafeHttpUrl(value)) return false;
  return new URL(value).protocol === "https:";
}

export function isSafeImageReference(value: string): boolean {
  return isSafeRootRelativePath(value) || isSafeHttpUrl(value);
}

export function isSafeVideoReference(
  source: VideoSource,
  value: string,
): boolean {
  if (source === "youtube") {
    if (!isSafeHttpUrl(value)) return false;
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      YOUTUBE_HOSTS.has(url.hostname.toLowerCase()) &&
      extractYouTubeId(value) !== null
    );
  }
  if (source === "upload") {
    return isSafeRootRelativePath(value, true) || isSafeHttpsUrl(value);
  }
  return isSafeHttpsUrl(value);
}

export function normalizeCmsMedia(value: unknown): CmsMedia | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;

  if (record.type === "image") {
    const image = typeof record.image === "string" ? record.image.trim() : "";
    return image && image.length <= 2048 && isSafeImageReference(image)
      ? { type: "image", image }
      : null;
  }

  if (record.type !== "video") return null;
  const rawVideo = record.video;
  if (!rawVideo || typeof rawVideo !== "object" || Array.isArray(rawVideo)) {
    return null;
  }
  const videoRecord = rawVideo as Record<string, unknown>;
  const source = videoRecord.source;
  const videoValue =
    typeof videoRecord.value === "string" ? videoRecord.value.trim() : "";
  if (
    (source !== "youtube" && source !== "url" && source !== "upload") ||
    !videoValue ||
    videoValue.length > 2048 ||
    !isSafeVideoReference(source, videoValue)
  ) {
    return null;
  }

  const rawThumbnail = record.thumbnail;
  const thumbnail =
    typeof rawThumbnail === "string" ? rawThumbnail.trim() : undefined;
  if (
    thumbnail &&
    (thumbnail.length > 2048 || !isSafeImageReference(thumbnail))
  ) {
    return null;
  }

  return {
    type: "video",
    video: { source, value: videoValue },
    ...(thumbnail ? { thumbnail } : {}),
  };
}

export function sanitizeCmsMedia(media: CmsMedia): CmsMedia {
  if (media.type === "image") {
    return { type: "image", image: media.image.trim() };
  }
  const thumbnail = media.thumbnail?.trim();
  return {
    type: "video",
    video: {
      source: media.video.source,
      value: media.video.value.trim(),
    },
    ...(thumbnail ? { thumbnail } : {}),
  };
}
