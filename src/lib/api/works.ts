import type { IWorkItem } from "@/data/works.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError, type VideoRef } from "@/lib/admin/types";
import { INDUSTRIES_TAG, type IndustrySummary } from "@/lib/api/industries";
import { extractYouTubeId } from "@/lib/media/video";

export const WORKS_TAG = "works";

export interface Metric {
  label: string;
  value: string;
  sub?: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface WorkClient {
  name: string;
  industry?: string;
  domain?: string;
  employees?: string;
  tags?: string[];
  desc?: string;
  logo?: string;
}

export interface ChallengeItem {
  title: string;
  desc: string;
}

export interface SolutionPhase {
  phase: string;
  time?: string;
  desc: string;
}

export interface WorkTestimonial {
  quote: string;
  avatar_url?: string;
  name: string;
  role: string;
}

/**
 * Admin/detail responses populate Industry, while transitional/lean responses
 * may still return the ObjectId. The optional ordering fields keep reads
 * tolerant of a minimal `{ _id, name, slug }` populate projection.
 */
export type WorkIndustry =
  | string
  | (Pick<IndustrySummary, "_id" | "name" | "slug"> &
      Partial<Pick<IndustrySummary, "order" | "is_active">>);

export interface Work {
  _id: string;
  industry?: WorkIndustry | null;
  slug: string;
  type: string;
  title: string;
  description: string;
  image: string;
  image_alt: string;
  metrics: Metric[];
  tag_slugs: string[];
  hero_stats?: HeroStat[];
  client?: WorkClient | null;
  situation_intro?: string | null;
  challenge_intro?: string | null;
  challenge_items?: ChallengeItem[];
  solution_intro?: string | null;
  solution_phases?: SolutionPhase[];
  outcome_desc?: string | null;
  outcome_video?: VideoRef | null;
  outcome_video_thumbnail?: string | null;
  testimonial?: WorkTestimonial | null;
  calendly_url?: string | null;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicWorksQuery {
  industrySlug?: string;
}

export async function getPublicWorks(
  query: PublicWorksQuery = {},
): Promise<Work[]> {
  try {
    const params = new URLSearchParams();
    if (query.industrySlug) {
      params.set("industry_slug", query.industrySlug);
    }
    const qs = params.toString();
    const res = await apiFetch<Work[]>(
      `/api/work/public${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [WORKS_TAG, INDUSTRIES_TAG],
      },
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicWorkBySlug(slug: string): Promise<Work | null> {
  try {
    const res = await apiFetch<Work>(
      `/api/work/public/${encodeURIComponent(slug)}`,
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [WORKS_TAG, INDUSTRIES_TAG, `work:${slug}`],
      },
    );
    if (!res.data) {
      throw new ApiError(
        502,
        "The API returned an empty work payload.",
        null,
      );
    }
    return res.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getAdminWorks(
  query: {
    search?: string;
    page?: number;
    limit?: number;
    filter?: "published" | "draft";
    industry?: string;
  } = {},
): Promise<{
  data: Work[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);
  if (query.industry) params.set("industry", query.industry);

  const qs = params.toString();
  const res = await apiFetch<Work[]>(`/api/work${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getWorkById(id: string): Promise<Work> {
  const res = await apiFetch<Work>(`/api/work/${id}`);
  return res.data;
}

/**
 * Adapts a backend `Work` to the legacy `IWorkItem` shape that the existing
 * public components (`WorksCard`, the case study detail page) consume.
 * Uses the slug as the `id` so URLs like `/works/<slug>` keep working.
 */
export function adaptWorkToLegacy(work: Work): IWorkItem {
  return {
    id: work.slug,
    type: work.type,
    title: work.title,
    description: work.description,
    image_url: work.image,
    image_alt: work.image_alt,
    created_at: work.created_at,
    metrics: work.metrics ?? [],
    tag_slugs: work.tag_slugs ?? [],
    hero_stats: work.hero_stats ?? [],
    client: work.client
      ? {
          name: work.client.name,
          industry: work.client.industry ?? "",
          domain: work.client.domain ?? "",
          employees: work.client.employees ?? "",
          tags: work.client.tags ?? [],
          desc: work.client.desc ?? "",
          logo: work.client.logo ?? "",
        }
      : undefined,
    situation_intro: work.situation_intro ?? undefined,
    challenge_intro: work.challenge_intro ?? undefined,
    challenge_items: work.challenge_items,
    solution_intro: work.solution_intro ?? undefined,
    solution_phases: work.solution_phases,
    outcome_desc: work.outcome_desc ?? undefined,
    outcome_video: resolveOutcomeVideo(work.outcome_video),
    outcome_video_thumbnail: resolveOutcomeThumbnail(
      work.outcome_video,
      work.outcome_video_thumbnail ?? undefined,
    ),
    testimonial: work.testimonial ?? undefined,
    calendly_url: work.calendly_url ?? undefined,
  };
}

function resolveOutcomeVideo(ref?: VideoRef | null): string | undefined {
  if (!ref?.value) return undefined;
  if (ref.source === "youtube") {
    const id = extractYouTubeId(ref.value);
    return id ? `https://www.youtube.com/embed/${id}` : ref.value;
  }
  return ref.value;
}

function resolveOutcomeThumbnail(
  ref?: VideoRef | null,
  thumbnail?: string,
): string | undefined {
  if (thumbnail) return thumbnail;
  if (ref?.source === "youtube") {
    const id = extractYouTubeId(ref.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return undefined;
}
