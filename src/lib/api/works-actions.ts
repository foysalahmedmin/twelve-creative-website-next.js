"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
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
  industry: string;
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
  order?: number;
  is_published?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = (...slugs: (string | undefined)[]) => {
  updateTag(WORKS_TAG);
  revalidatePath("/admin/works");
  revalidatePath("/works");
  for (const slug of new Set(slugs.filter((value): value is string => Boolean(value)))) {
    updateTag(`work:${slug}`);
    revalidatePath(`/works/${slug}`);
  }
};

/** Create treats empty optional embedded sections as omitted. PATCH preserves
 * explicit nulls so an editor can remove an existing client/testimonial/video. */
const stripCreateNulls = <T extends Partial<WorkInput>>(input: T): T => {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== null),
  ) as T;
};

export async function createWorkAction(
  payload: WorkInput,
): Promise<ActionResult<Work>> {
  try {
    const res = await apiFetch<Work>("/api/work", {
      method: "POST",
      body: stripCreateNulls(payload),
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
  previousSlug?: string,
): Promise<ActionResult<Work>> {
  try {
    const res = await apiFetch<Work>(`/api/work/${id}`, {
      method: "PATCH",
      body: payload,
    });
    invalidate(res.data?.slug, previousSlug);
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
  unstable_rethrow(e);
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
