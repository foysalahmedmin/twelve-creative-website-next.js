/**
 * Public + admin readers for Industries.
 *
 * Industries drive two UI surfaces:
 *  - Home page `IndustriesSection` (tabbed pills + showcase card)
 *  - `/industries` `IndustriesDetailSection` (2-col grid with slug anchors)
 *
 * Anchor links use the slug as a fragment: `/industries#<slug>`.
 */

import type { TIndustry, TIndustryIconKey } from "@/data/industries.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

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
  thumbnail?: string;
  video?: VideoRef;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Resolves an industry VideoRef to a plain URL string for react-player. */
export function resolveIndustryVideoSrc(
  video: VideoRef | null | undefined,
): string | undefined {
  return video?.value || undefined;
}

/** Resolves thumbnail with priority: manual thumbnail > YouTube auto > undefined */
export function resolveIndustryThumbnail(
  thumbnail: string | undefined,
  video: VideoRef | null | undefined,
): string | undefined {
  if (thumbnail) return thumbnail;
  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return undefined;
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
 * Adapts API shape into the legacy `TIndustry[]` the existing
 * `IndustriesSection` / `IndustriesDetailSection` already consume, so the
 * swap requires no component refactor.
 */
export function toLegacyIndustries(items: ApiIndustry[]): TIndustry[] {
  return items.map((i) => ({
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
  }));
}

export async function getPublicIndustriesAsLegacy(): Promise<TIndustry[]> {
  const items = await getPublicIndustries();
  return toLegacyIndustries(items);
}
