import type { VideoRef } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

/** Resolves an Industry VideoRef to a player-compatible URL. */
export function resolveIndustryVideoSrc(
  video: VideoRef | null | undefined,
): string | undefined {
  const value = video?.value?.trim();
  return value || undefined;
}

/** Resolves thumbnail with priority: manual thumbnail > YouTube auto > undefined. */
export function resolveIndustryThumbnail(
  thumbnail: string | null | undefined,
  video: VideoRef | null | undefined,
): string | undefined {
  const manualThumbnail = thumbnail?.trim();
  if (manualThumbnail) return manualThumbnail;

  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  return undefined;
}

export type IndustryReelMediaInput = {
  image?: string | null;
  thumbnail?: string | null;
  video?: VideoRef | null;
  reel_thumbnail?: string | null;
  reel_video?: VideoRef | null;
};

export type IndustryReelMedia = {
  videoSrc?: string;
  thumbnailSrc?: string;
};

/**
 * Resolves short-form card media without changing the Industry detail hero.
 * Each reel field falls back independently so partially migrated records keep
 * working: reel video -> hero video; reel poster -> reel YouTube poster ->
 * hero poster/YouTube poster -> the Industry image.
 */
export function resolveIndustryReelMedia(
  industry: IndustryReelMediaInput,
): IndustryReelMedia {
  const fallbackImage = industry.image?.trim() || undefined;

  return {
    videoSrc:
      resolveIndustryVideoSrc(industry.reel_video) ??
      resolveIndustryVideoSrc(industry.video),
    thumbnailSrc:
      resolveIndustryThumbnail(industry.reel_thumbnail, industry.reel_video) ??
      resolveIndustryThumbnail(industry.thumbnail, industry.video) ??
      fallbackImage,
  };
}
