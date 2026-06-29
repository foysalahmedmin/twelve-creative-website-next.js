/**
 * Public + admin readers for Featured Projects.
 *
 * The home page renders these in tabbed groups, one tab per `category`.
 * Free-form category strings let the admin create new tabs without touching
 * code — "Brand Films", "Hospitality", "Aviation", whatever they need.
 */

import type {
  TFeaturedAspect,
  TFeaturedCategory,
} from "@/data/featured-projects.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";

export const FEATURED_PROJECTS_TAG = "featured-projects";

export type FeaturedProjectAspect = "reel" | "landscape";

export interface FeaturedProject {
  _id: string;
  title: string;
  category: string;
  aspect: FeaturedProjectAspect;
  thumbnail: string;
  video: VideoRef;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    const res = await apiFetch<FeaturedProject[]>(
      "/api/featured-project/public",
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [FEATURED_PROJECTS_TAG],
      },
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminFeaturedProjects(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: FeaturedProject[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

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
 * Groups public featured projects into the legacy `TFeaturedCategory[]` shape
 * the home page's `FeaturedProjectsSection` already consumes — one tab per
 * unique category string, preserving the admin-defined order across tabs.
 */
export async function getPublicFeaturedProjectsGrouped(): Promise<
  TFeaturedCategory[]
> {
  const items = await getPublicFeaturedProjects();
  if (!items.length) return [];

  // Preserve admin-defined order; first occurrence of a category determines
  // its tab position; within each tab, items keep their global order.
  const groups = new Map<string, TFeaturedCategory>();

  for (const item of items) {
    const id = slugifyCategory(item.category);
    let group = groups.get(id);
    if (!group) {
      // Tab aspect = aspect of the first project in this category.
      // Mixed-aspect categories aren't blocked at the schema level, but the
      // legacy grid layout depends on a single aspect per tab, so we lock it.
      group = {
        id,
        label: item.category,
        aspect: item.aspect as TFeaturedAspect,
        projects: [],
      };
      groups.set(id, group);
    }
    group.projects.push({
      id: item._id,
      title: item.title,
      thumbnail_src: item.thumbnail,
      video_src: item.video.value,
    });
  }

  return Array.from(groups.values());
}

function slugifyCategory(c: string): string {
  return c
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
