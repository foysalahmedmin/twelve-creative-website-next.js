import type { IWorkItem } from "@/data/works.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
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

export interface Work {
  _id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  image: string;
  image_alt: string;
  metrics: Metric[];
  tag_slugs: string[];
  hero_stats?: HeroStat[];
  client?: WorkClient;
  situation_intro?: string;
  challenge_intro?: string;
  challenge_items?: ChallengeItem[];
  solution_intro?: string;
  solution_phases?: SolutionPhase[];
  outcome_desc?: string;
  outcome_video?: VideoRef;
  outcome_video_thumbnail?: string;
  testimonial?: WorkTestimonial;
  calendly_url?: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPublicWorks(): Promise<Work[]> {
  try {
    const res = await apiFetch<Work[]>("/api/work/public", {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [WORKS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicWorkBySlug(
  slug: string,
): Promise<Work | null> {
  try {
    const res = await apiFetch<Work>(`/api/work/public/${slug}`, {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [WORKS_TAG, `work:${slug}`],
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getAdminWorks(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "published" | "draft";
} = {}): Promise<{
  data: Work[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

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
    situation_intro: work.situation_intro,
    challenge_intro: work.challenge_intro,
    challenge_items: work.challenge_items,
    solution_intro: work.solution_intro,
    solution_phases: work.solution_phases,
    outcome_desc: work.outcome_desc,
    outcome_video: resolveOutcomeVideo(work.outcome_video),
    testimonial: work.testimonial,
    calendly_url: work.calendly_url,
  };
}

function resolveOutcomeVideo(ref?: VideoRef): string | undefined {
  if (!ref?.value) return undefined;
  if (ref.source === "youtube") {
    const id = extractYouTubeId(ref.value);
    return id ? `https://www.youtube.com/embed/${id}` : ref.value;
  }
  return ref.value;
}
