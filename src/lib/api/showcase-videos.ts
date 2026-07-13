/**
 * Public + admin readers for showcase videos.
 *
 * One `showcase-video` collection feeds two different public surfaces, split
 * by the `aspect` field:
 *   - `aspect: 'reel'`      → Visual Library vertical marquee on Works page
 *   - `aspect: 'landscape'` → "Work Showcase" thumbnail grid (Works page + Canvus)
 *
 * Public reader is tagged so admin mutations invalidate it.
 */

import type { IMarqueeItem } from "@/data/vertical-marquee.data";
import type {
  IPortfolioItem,
  TPortfolioData,
} from "@/data/thumbnail-work-section.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

export const SHOWCASE_VIDEOS_TAG = "showcase-videos";

export type ShowcaseAspect = "reel" | "landscape";

export interface ShowcaseVideo {
  _id: string;
  video: VideoRef;
  thumbnail?: string;
  alt: string;
  aspect: ShowcaseAspect;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicShowcaseVideos(
  aspect?: ShowcaseAspect,
): Promise<ShowcaseVideo[]> {
  try {
    const qs = aspect ? `?aspect=${aspect}` : "";
    const res = await apiFetch<ShowcaseVideo[]>(
      `/api/showcase-video/public${qs}`,
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
 * Adapts active reel-aspect videos to the legacy `IMarqueeItem` shape so
 * `VerticalMarqueeSlider` (Visual Library) consumes them with no changes.
 */
export async function getPublicShowcaseVideosForMarquee(): Promise<
  IMarqueeItem[]
> {
  const items = await getPublicShowcaseVideos("reel");
  return items.map(adaptForMarquee);
}

/**
 * Adapts active landscape-aspect videos to the legacy `TPortfolioData` shape
 * so `ThumbnailWorkSection` consumes them with no changes. Chrome
 * (label/title/description/type) comes from the caller's defaults.
 */
export async function getPublicShowcaseVideosForThumbnailGrid(
  defaults: Omit<TPortfolioData, "work">,
): Promise<TPortfolioData> {
  const items = await getPublicShowcaseVideos("landscape");
  const work: IPortfolioItem[] = items.map((item) => ({
    id: item._id,
    thumbnail: resolvePoster(item.video, item.thumbnail),
    video_link: item.video?.value ?? "",
    title: item.alt,
  }));
  return { ...defaults, work };
}

function adaptForMarquee(item: ShowcaseVideo): IMarqueeItem {
  return {
    image_url: resolvePoster(item.video, item.thumbnail),
    video_url: item.video?.value ?? "",
    alt: item.alt,
  };
}

function resolvePoster(video: VideoRef | undefined, thumbnail?: string): string {
  if (thumbnail) return thumbnail;
  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "";
}
