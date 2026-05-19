"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { INSIGHTS_TAG, type Insight } from "./insights";

export interface InsightInput {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string;
  category?: string;
  author?: string;
  status?: "draft" | "published";
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = (slug?: string) => {
  updateTag(INSIGHTS_TAG);
  if (slug) updateTag(`insight:${slug}`);
  revalidatePath("/admin/insights");
  revalidatePath("/blogs");
};

export async function createInsightAction(
  payload: InsightInput,
): Promise<ActionResult<Insight>> {
  try {
    const res = await apiFetch<Insight>("/api/insight", {
      method: "POST",
      body: sanitize(payload),
    });
    invalidate(res.data?.slug);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateInsightAction(
  id: string,
  payload: Partial<InsightInput>,
): Promise<ActionResult<Insight>> {
  try {
    const res = await apiFetch<Insight>(`/api/insight/${id}`, {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate(res.data?.slug);
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function togglePublishInsightAction(
  id: string,
  status: "draft" | "published",
  slug?: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/insight/${id}`, {
      method: "PATCH",
      body: { status },
    });
    invalidate(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteInsightAction(
  id: string,
  slug?: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/insight/${id}`, { method: "DELETE" });
    invalidate(slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<InsightInput>>(input: T): T {
  const out = { ...input } as T;
  if (out.category === "") delete (out as { category?: unknown }).category;
  if (out.author === "") delete (out as { author?: unknown }).author;
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
