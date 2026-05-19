"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { BRANDS_TAG, type Brand } from "./brands";

export interface BrandInput {
  name: string;
  logo: string;
  href?: string;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(BRANDS_TAG);
  revalidatePath("/admin/brands");
};

export async function createBrandAction(
  payload: BrandInput,
): Promise<ActionResult<Brand>> {
  try {
    const res = await apiFetch<Brand>("/api/brand", {
      method: "POST",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateBrandAction(
  id: string,
  payload: Partial<BrandInput>,
): Promise<ActionResult<Brand>> {
  try {
    const res = await apiFetch<Brand>(`/api/brand/${id}`, {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteBrandAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/brand/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleBrandActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/brand/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<BrandInput>>(input: T): T {
  const out = { ...input } as T;
  if (out.href === "") delete (out as { href?: unknown }).href;
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
