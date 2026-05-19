"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { FAQS_TAG, type Faq } from "./faqs";

export interface FaqInput {
  question: string;
  answer: string;
  group?: string;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(FAQS_TAG);
  revalidatePath("/admin/faqs");
};

export async function createFaqAction(payload: FaqInput): Promise<ActionResult<Faq>> {
  try {
    const res = await apiFetch<Faq>("/api/faq", { method: "POST", body: sanitize(payload) });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateFaqAction(id: string, payload: Partial<FaqInput>): Promise<ActionResult<Faq>> {
  try {
    const res = await apiFetch<Faq>(`/api/faq/${id}`, { method: "PATCH", body: sanitize(payload) });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteFaqAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/faq/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleFaqActiveAction(id: string, is_active: boolean): Promise<ActionResult> {
  try {
    await apiFetch(`/api/faq/${id}`, { method: "PATCH", body: { is_active } });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<FaqInput>>(input: T): T {
  const out = { ...input } as T;
  if (out.group === "") delete (out as { group?: unknown }).group;
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
