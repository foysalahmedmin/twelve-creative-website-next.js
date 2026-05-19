"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { VideoRef } from "@/lib/admin/types";
import {
  WORKS_TAG,
  type Work,
  type WorkClient,
  type WorkTestimonial,
  type Metric,
  type HeroStat,
  type ChallengeItem,
  type SolutionPhase,
} from "./works";

export interface WorkInput {
  slug: string;
  type: string;
  title: string;
  description: string;
  image: string;
  image_alt: string;
  metrics?: Metric[];
  tag_slugs?: string[];
  hero_stats?: HeroStat[];
  client?: WorkClient | null;
  situation_intro?: string;
  challenge_intro?: string;
  challenge_items?: ChallengeItem[];
  solution_intro?: string;
  solution_phases?: SolutionPhase[];
  outcome_desc?: string;
  outcome_video?: VideoRef | null;
  outcome_video_thumbnail?: string;
  testimonial?: WorkTestimonial | null;
  calendly_url?: string;
  order?: number;
  is_published?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = (slug?: string) => {
  updateTag(WORKS_TAG);
  if (slug) updateTag(`work:${slug}`);
  revalidatePath("/admin/works");
};

const stripNulls = <T extends Partial<WorkInput>>(input: T): T => {
  const out = { ...input } as T;
  if (out.client === null) delete (out as { client?: unknown }).client;
  if (out.outcome_video === null)
    delete (out as { outcome_video?: unknown }).outcome_video;
  if (out.testimonial === null)
    delete (out as { testimonial?: unknown }).testimonial;
  return out;
};

export async function createWorkAction(
  payload: WorkInput,
): Promise<ActionResult<Work>> {
  try {
    const res = await apiFetch<Work>("/api/work", {
      method: "POST",
      body: stripNulls(payload),
    });
    invalidate(res.data?.slug);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateWorkAction(
  id: string,
  payload: Partial<WorkInput>,
): Promise<ActionResult<Work>> {
  try {
    const res = await apiFetch<Work>(`/api/work/${id}`, {
      method: "PATCH",
      body: stripNulls(payload),
    });
    invalidate(res.data?.slug);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function togglePublishWorkAction(
  id: string,
  is_published: boolean,
  slug?: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/work/${id}`, {
      method: "PATCH",
      body: { is_published },
    });
    invalidate(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteWorkAction(
  id: string,
  slug?: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/work/${id}`, { method: "DELETE" });
    invalidate(slug);
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
