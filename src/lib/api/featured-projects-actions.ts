"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { VideoRef } from "@/lib/admin/types";
import {
  FEATURED_PROJECTS_TAG,
  type FeaturedProject,
  type FeaturedProjectAspect,
} from "./featured-projects";

export interface FeaturedProjectInput {
  title: string;
  category: string;
  aspect?: FeaturedProjectAspect;
  thumbnail: string;
  video: VideoRef;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(FEATURED_PROJECTS_TAG);
  revalidatePath("/admin/featured-projects");
};

export async function createFeaturedProjectAction(
  payload: FeaturedProjectInput,
): Promise<ActionResult<FeaturedProject>> {
  try {
    const res = await apiFetch<FeaturedProject>("/api/featured-project", {
      method: "POST",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateFeaturedProjectAction(
  id: string,
  payload: Partial<FeaturedProjectInput>,
): Promise<ActionResult<FeaturedProject>> {
  try {
    const res = await apiFetch<FeaturedProject>(
      `/api/featured-project/${id}`,
      { method: "PATCH", body: payload },
    );
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteFeaturedProjectAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/featured-project/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleFeaturedProjectActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/featured-project/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    const sources = e.body?.errorSources;
    if (sources && sources.length) {
      return sources.map((s) => `${s.path}: ${s.message}`).join(" · ");
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
