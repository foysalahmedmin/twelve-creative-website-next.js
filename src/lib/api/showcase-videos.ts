/**
 * Public + admin readers for the Visual Library (showcase videos).
 *
 * Public reader is tagged so admin mutations can invalidate it.
 *
 * `getPublicShowcaseVideosForMarquee()` adapts to the legacy
 * `IMarqueeItem` shape (`image_url`, `video_url`, `alt`) so the
 * existing `VerticalMarqueeSlider` doesn't need to change.
 */

import type { IMarqueeItem } from "@/data/vertical-marquee.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

export const SHOWCASE_VIDEOS_TAG = "showcase-videos";

export interface ShowcaseVideo {
  _id: string;
  video: VideoRef;
  thumbnail?: string;
  alt: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicShowcaseVideos(): Promise<ShowcaseVideo[]> {
  try {
    const res = await apiFetch<ShowcaseVideo[]>(
      "/api/showcase-video/public",
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [SHOWCASE_VIDEOS_TAG],
      },
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminShowcaseVideos(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: ShowcaseVideo[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<ShowcaseVideo[]>(
    `/api/showcase-video${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getShowcaseVideoById(
  id: string,
): Promise<ShowcaseVideo> {
  const res = await apiFetch<ShowcaseVideo>(`/api/showcase-video/${id}`);
  return res.data;
}

/**
 * Adapts active showcase videos to the legacy IMarqueeItem shape so
 * `VerticalMarqueeSlider` consumes them with no code change.
 */
export async function getPublicShowcaseVideosForMarquee(): Promise<
  IMarqueeItem[]
> {
  const items = await getPublicShowcaseVideos();
  return items.map(adaptForMarquee);
}

function adaptForMarquee(item: ShowcaseVideo): IMarqueeItem {
  return {
    image_url: resolvePoster(item.video, item.thumbnail),
    video_url: item.video.value,
    alt: item.alt,
  };
}

function resolvePoster(video: VideoRef, thumbnail?: string): string {
  if (thumbnail) return thumbnail;
  if (video.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "";
}
