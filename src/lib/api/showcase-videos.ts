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
import { INDUSTRIES_TAG, type IndustrySummary } from "@/lib/api/industries";
import { extractYouTubeId } from "@/lib/media/video";

export const SHOWCASE_VIDEOS_TAG = "showcase-videos";

export type ShowcaseAspect = "reel" | "landscape";

export interface ShowcaseVideo {
  _id: string;
  industry: IndustrySummary;
  video: VideoRef;
  thumbnail?: string;
  alt: string;
  aspect: ShowcaseAspect;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PublicShowcaseVideoQuery {
  aspect?: ShowcaseAspect;
  industrySlug?: string;
}

export async function getPublicShowcaseVideos(
  query: PublicShowcaseVideoQuery = {},
): Promise<ShowcaseVideo[]> {
  try {
    const params = new URLSearchParams();
    if (query.aspect) params.set("aspect", query.aspect);
    if (query.industrySlug) {
      params.set("industry_slug", query.industrySlug);
    }
    const qs = params.toString();
    const res = await apiFetch<ShowcaseVideo[]>(
      `/api/showcase-video/public${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [SHOWCASE_VIDEOS_TAG, INDUSTRIES_TAG],
      },
    );
    return (res.data ?? [])
      .filter((item) => item.industry?._id && item.industry.is_active === true)
      .sort(
        (left, right) =>
          left.industry.order - right.industry.order ||
          left.order - right.order ||
          left._id.localeCompare(right._id),
      );
  } catch {
    return [];
  }
}

export async function getAdminShowcaseVideos(
  query: {
    search?: string;
    page?: number;
    limit?: number;
    filter?: "active" | "inactive";
    industry?: string;
    aspect?: ShowcaseAspect;
  } = {},
): Promise<{
  data: ShowcaseVideo[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);
  if (query.industry) params.set("industry", query.industry);
  if (query.aspect) params.set("aspect", query.aspect);

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

export async function getShowcaseVideoById(id: string): Promise<ShowcaseVideo> {
  const res = await apiFetch<ShowcaseVideo>(`/api/showcase-video/${id}`);
  return res.data;
}

/**
 * Adapts active reel-aspect videos to the legacy `IMarqueeItem` shape so
 * `VerticalMarqueeSlider` (Visual Library) consumes them with no changes.
 */
export async function getPublicShowcaseVideosForMarquee(
  query: Pick<PublicShowcaseVideoQuery, "industrySlug"> = {},
): Promise<IMarqueeItem[]> {
  const items = await getPublicShowcaseVideos({ ...query, aspect: "reel" });
  return items.flatMap((item) => {
    const adapted = adaptForMarquee(item);
    return adapted.image_url && adapted.video_url ? [adapted] : [];
  });
}

/**
 * Adapts active landscape-aspect videos to the legacy `TPortfolioData` shape
 * so `ThumbnailWorkSection` consumes them with no changes. Chrome
 * (label/title/description/type) comes from the caller's defaults.
 */
export async function getPublicShowcaseVideosForThumbnailGrid(
  defaults: Omit<TPortfolioData, "work">,
  query: Pick<PublicShowcaseVideoQuery, "industrySlug"> = {},
): Promise<TPortfolioData> {
  const items = await getPublicShowcaseVideos({
    ...query,
    aspect: "landscape",
  });
  const work: IPortfolioItem[] = items.flatMap((item) => {
    const thumbnail = resolvePoster(item.video, item.thumbnail);
    const videoLink = item.video?.value ?? "";
    return thumbnail && videoLink
      ? [
          {
            id: item._id,
            thumbnail,
            video_link: videoLink,
            title: item.alt,
          },
        ]
      : [];
  });
  return { ...defaults, work };
}

function adaptForMarquee(item: ShowcaseVideo): IMarqueeItem {
  return {
    image_url: resolvePoster(item.video, item.thumbnail),
    video_url: item.video?.value ?? "",
    alt: item.alt,
  };
}

function resolvePoster(
  video: VideoRef | undefined,
  thumbnail?: string,
): string {
  if (thumbnail) return thumbnail;
  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "";
}
