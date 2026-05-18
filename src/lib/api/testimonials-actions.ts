"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  TESTIMONIALS_TAG,
  type Testimonial,
  type TestimonialCategory,
} from "./testimonials";
import type { VideoRef } from "@/lib/admin/types";

export interface TestimonialInput {
  name: string;
  designation: string;
  image: string;
  category: TestimonialCategory;
  message?: string;
  video_message?: VideoRef | null;
  thumbnail?: string;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(TESTIMONIALS_TAG);
  revalidatePath("/admin/testimonials");
};

export async function createTestimonialAction(
  payload: TestimonialInput,
): Promise<ActionResult<Testimonial>> {
  try {
    const res = await apiFetch<Testimonial>("/api/testimonial", {
      method: "POST",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateTestimonialAction(
  id: string,
  payload: Partial<TestimonialInput>,
): Promise<ActionResult<Testimonial>> {
  try {
    const res = await apiFetch<Testimonial>(`/api/testimonial/${id}`, {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteTestimonialAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/testimonial/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleTestimonialActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/testimonial/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function reorderTestimonialsAction(
  items: { _id: string; order: number }[],
): Promise<ActionResult> {
  try {
    await apiFetch("/api/testimonial/reorder", {
      method: "POST",
      body: { items },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<TestimonialInput>>(input: T): T {
  // Strip nullish optional fields the API doesn't expect
  const out = { ...input } as T;
  if (out.video_message === null) delete (out as { video_message?: unknown }).video_message;
  if (out.thumbnail === "") delete (out as { thumbnail?: unknown }).thumbnail;
  if (out.message === "") delete (out as { message?: unknown }).message;
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
