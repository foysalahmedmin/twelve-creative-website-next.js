"use server";

import { revalidatePath, updateTag } from "next/cache";
import type { TServiceIconKey } from "@/data/services.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { SERVICES_TAG, type ApiService } from "./services";

export interface ServiceInput {
  slug: string;
  title: string;
  description: string;
  highlights?: string[];
  image: string;
  icon: TServiceIconKey;
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
  updateTag(SERVICES_TAG);
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/what-we-build");
};

export async function createServiceAction(
  payload: ServiceInput,
): Promise<ActionResult<ApiService>> {
  try {
    const res = await apiFetch<ApiService>("/api/service", {
      method: "POST",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateServiceAction(
  id: string,
  payload: Partial<ServiceInput>,
): Promise<ActionResult<ApiService>> {
  try {
    const res = await apiFetch<ApiService>(`/api/service/${id}`, {
      method: "PATCH",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/service/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleServiceActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/service/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function reorderServicesAction(
  items: { _id: string; order: number }[],
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/service/reorder`, {
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
