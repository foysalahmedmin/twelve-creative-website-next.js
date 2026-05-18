/**
 * Standard video helper used wherever a `VideoRef` is rendered.
 *
 * VideoRef shape (matches backend):
 *   { source: 'youtube' | 'url' | 'upload'; value: string }
 *
 * The function returns a uniform `{ embedUrl, posterUrl, isYouTube }`
 * regardless of source, so consumers (player, card, marquee) never branch.
 */

export type VideoSource = "youtube" | "url" | "upload";

export interface VideoRef {
  source: VideoSource;
  value: string;
}

export interface ResolvedVideo {
  embedUrl: string;
  posterUrl: string;
  isYouTube: boolean;
  youtubeId: string | null;
}

const YT_THUMB = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/** Extracts the 11-char YouTube ID from any common YouTube URL form. */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  // Already an ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1).split("/")[0] || null;
    }
    // youtube.com/watch?v=<id>
    if (url.hostname.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      // /embed/<id> or /shorts/<id>
      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    }
  } catch {
    // not a URL — fall through
  }
  return null;
}

export function isYouTubeUrl(input: string): boolean {
  return extractYouTubeId(input) !== null;
}

/**
 * Resolves a VideoRef + optional thumbnail into render-ready URLs.
 * If `thumbnail` is missing and the video is YouTube, we derive the poster.
 */
export function resolveVideo(
  video: VideoRef | null | undefined,
  thumbnail?: string | null,
): ResolvedVideo | null {
  if (!video?.value) return null;

  if (video.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (!id) {
      // Invalid YouTube value — best-effort fallback to direct URL.
      return {
        embedUrl: video.value,
        posterUrl: thumbnail ?? "",
        isYouTube: false,
        youtubeId: null,
      };
    }
    return {
      embedUrl: `https://www.youtube.com/embed/${id}`,
      posterUrl: thumbnail || YT_THUMB(id),
      isYouTube: true,
      youtubeId: id,
    };
  }

  return {
    embedUrl: video.value,
    posterUrl: thumbnail ?? "",
    isYouTube: false,
    youtubeId: null,
  };
}
