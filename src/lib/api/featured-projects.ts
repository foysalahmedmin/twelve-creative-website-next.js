/**
 * Public + admin readers for Featured Projects.
 *
 * The home page renders these in tabbed groups, one tab per populated
 * Industry relation.
 */

import type { TFeaturedIndustryGroup } from "@/data/featured-projects.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { INDUSTRIES_TAG, type IndustrySummary } from "@/lib/api/industries";

export const FEATURED_PROJECTS_TAG = "featured-projects";

export type FeaturedProjectAspect = "reel" | "landscape";

export interface FeaturedProject {
  _id: string;
  title: string;
  industry: IndustrySummary;
  aspect: FeaturedProjectAspect;
  thumbnail: string;
  video: VideoRef;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PublicFeaturedProjectQuery {
  industrySlug?: string;
}

export async function getPublicFeaturedProjects(
  query: PublicFeaturedProjectQuery = {},
): Promise<FeaturedProject[]> {
  try {
    const params = new URLSearchParams();
    if (query.industrySlug) {
      params.set("industry_slug", query.industrySlug);
    }
    const qs = params.toString();
    const res = await apiFetch<FeaturedProject[]>(
      `/api/featured-project/public${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [FEATURED_PROJECTS_TAG, INDUSTRIES_TAG],
      },
    );
    return (res.data ?? []).filter(
      (item) => item.industry?._id && item.industry.is_active === true,
    );
  } catch {
    return [];
  }
}

export async function getAdminFeaturedProjects(
  query: {
    search?: string;
    page?: number;
    limit?: number;
    filter?: "active" | "inactive";
    industry?: string;
    aspect?: FeaturedProjectAspect;
  } = {},
): Promise<{
  data: FeaturedProject[];
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
  const res = await apiFetch<FeaturedProject[]>(
    `/api/featured-project${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getFeaturedProjectById(
  id: string,
): Promise<FeaturedProject> {
  const res = await apiFetch<FeaturedProject>(`/api/featured-project/${id}`);
  return res.data;
}

/**
 * Groups projects by stable Industry ObjectId. Industry order controls tab
 * order and each project's own order/aspect controls its card within the tab.
 */
export async function getPublicFeaturedProjectsGrouped(): Promise<
  TFeaturedIndustryGroup[]
> {
  const items = await getPublicFeaturedProjects();
  if (!items.length) return [];

  const groups = new Map<string, TFeaturedIndustryGroup>();

  for (const item of [...items].sort((a, b) => a.order - b.order)) {
    const industry = item.industry;
    // Protect the public render from an old/orphaned document during rollout.
    if (!industry?._id || !industry.name || industry.is_active !== true) {
      continue;
    }

    let group = groups.get(industry._id);
    if (!group) {
      group = {
        id: industry._id,
        label: industry.name,
        order: industry.order ?? Number.MAX_SAFE_INTEGER,
        projects: [],
      };
      groups.set(industry._id, group);
    }
    group.projects.push({
      id: item._id,
      title: item.title,
      aspect: item.aspect,
      thumbnail_src: item.thumbnail,
      video_src: item.video?.value ?? "",
    });
  }

  return Array.from(groups.values()).sort(
    (a, b) => a.order - b.order || a.label.localeCompare(b.label),
  );
}
