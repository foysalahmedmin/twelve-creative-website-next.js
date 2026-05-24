"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { TIndustryIconKey } from "@/data/industries.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { INDUSTRIES_TAG, type ApiIndustry } from "./industries";

export interface IndustryInput {
  slug: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  icon: TIndustryIconKey;
  work?: string[];
  cta_label?: string;
  cta_href?: string;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(INDUSTRIES_TAG);
  revalidatePath("/admin/industries");
  revalidatePath("/");
  revalidatePath("/industries");
};

export async function createIndustryAction(
  payload: IndustryInput,
): Promise<ActionResult<ApiIndustry>> {
  try {
    const res = await apiFetch<ApiIndustry>("/api/industry", {
      method: "POST",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateIndustryAction(
  id: string,
  payload: Partial<IndustryInput>,
): Promise<ActionResult<ApiIndustry>> {
  try {
    const res = await apiFetch<ApiIndustry>(`/api/industry/${id}`, {
      method: "PATCH",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteIndustryAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/industry/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleIndustryActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/industry/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function reorderIndustriesAction(
  items: { _id: string; order: number }[],
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/industry/reorder`, {
      method: "POST",
      body: { items },
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
