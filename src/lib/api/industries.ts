/**
 * Public + admin readers for Industries.
 *
 * Industries drive three UI surfaces:
 *  - Home page `IndustriesSection` (tabbed pills + showcase card)
 *  - `/industries` `IndustriesDetailSection` (2-col grid with slug anchors)
 *  - `CoreVerticalsSection` cards on selected public pages
 *
 * Anchor links use the slug as a fragment: `/industries#<slug>`.
 */

import type { TIndustry, TIndustryIconKey } from "@/data/industries.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import {
  resolveIndustryReelMedia,
  resolveIndustryThumbnail,
  resolveIndustryVideoSrc,
} from "@/lib/media/industry";

export {
  resolveIndustryReelMedia,
  resolveIndustryThumbnail,
  resolveIndustryVideoSrc,
} from "@/lib/media/industry";
export type {
  IndustryReelMedia,
  IndustryReelMediaInput,
} from "@/lib/media/industry";

export const INDUSTRIES_TAG = "industries";

/**
 * The populated Industry shape returned by resources that belong to an
 * Industry (for example Featured Projects and Showcase Videos).
 */
export interface IndustrySummary {
  _id: string;
  name: string;
  slug: string;
  order: number;
  is_active: boolean;
}

export interface ApiIndustry {
  _id: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  icon: TIndustryIconKey;
  work: string[];
  cta_label?: string;
  cta_href?: string;
  tagline?: string;
  thumbnail?: string | null;
  video?: VideoRef | null;
  reel_thumbnail?: string | null;
  reel_video?: VideoRef | null;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicIndustries(): Promise<ApiIndustry[]> {
  try {
    const res = await apiFetch<ApiIndustry[]>("/api/industry/public", {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [INDUSTRIES_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminIndustries(
  query: {
    search?: string;
    page?: number;
    limit?: number;
    filter?: "active" | "inactive";
  } = {},
): Promise<{
  data: ApiIndustry[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<ApiIndustry[]>(
    `/api/industry${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

/** Lightweight Industry list for authenticated relational selectors. */
export async function getAdminIndustryOptions(): Promise<IndustrySummary[]> {
  const res = await apiFetch<IndustrySummary[]>("/api/industry/options");
  if (!res.success || !Array.isArray(res.data)) {
    throw new Error("Unable to load Industry options");
  }
  return res.data;
}

export async function getIndustryById(id: string): Promise<ApiIndustry> {
  const res = await apiFetch<ApiIndustry>(`/api/industry/${id}`);
  return res.data;
}

/**
 * Adapts API shape into the legacy `TIndustry[]`. Existing `videoSrc` and
 * `thumbnailSrc` intentionally remain tied to the detail/overview film; the
 * separate reel fields are consumed only by short-form home cards.
 */
export function toLegacyIndustries(items: ApiIndustry[]): TIndustry[] {
  return items.map((i) => {
    const reelMedia = resolveIndustryReelMedia(i);

    return {
      id: i.slug,
      icon: i.icon,
      name: i.name,
      headline: i.headline,
      description: i.description,
      image: i.image,
      work: i.work ?? [],
      href:
        i.cta_href && i.cta_href.trim() ? i.cta_href : `/industries#${i.slug}`,
      videoSrc: resolveIndustryVideoSrc(i.video),
      thumbnailSrc: resolveIndustryThumbnail(i.thumbnail, i.video),
      reelVideoSrc: reelMedia.videoSrc,
      reelThumbnailSrc: reelMedia.thumbnailSrc,
    };
  });
}

export async function getPublicIndustriesAsLegacy(): Promise<TIndustry[]> {
  const items = await getPublicIndustries();
  return toLegacyIndustries(items);
}
