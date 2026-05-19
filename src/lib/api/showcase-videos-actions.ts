"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { VideoRef } from "@/lib/admin/types";
import {
  SHOWCASE_VIDEOS_TAG,
  type ShowcaseVideo,
} from "./showcase-videos";

export interface ShowcaseVideoInput {
  video: VideoRef;
  thumbnail?: string;
  alt: string;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(SHOWCASE_VIDEOS_TAG);
  revalidatePath("/admin/videos");
};

export async function createShowcaseVideoAction(
  payload: ShowcaseVideoInput,
): Promise<ActionResult<ShowcaseVideo>> {
  try {
    const res = await apiFetch<ShowcaseVideo>("/api/showcase-video", {
      method: "POST",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateShowcaseVideoAction(
  id: string,
  payload: Partial<ShowcaseVideoInput>,
): Promise<ActionResult<ShowcaseVideo>> {
  try {
    const res = await apiFetch<ShowcaseVideo>(`/api/showcase-video/${id}`, {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteShowcaseVideoAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/showcase-video/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleShowcaseVideoActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/showcase-video/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function reorderShowcaseVideosAction(
  items: { _id: string; order: number }[],
): Promise<ActionResult> {
  try {
    await apiFetch("/api/showcase-video/reorder", {
      method: "POST",
      body: { items },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<ShowcaseVideoInput>>(input: T): T {
  const out = { ...input } as T;
  if (out.thumbnail === "") delete (out as { thumbnail?: unknown }).thumbnail;
  return out;
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
