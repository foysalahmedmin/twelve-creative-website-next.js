import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";

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
