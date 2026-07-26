"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { PAGE_CTA_TAG, type ApiPageCta, type PageCtaInput } from "./page-ctas";

export interface PageCtaActionResult {
  ok: boolean;
  error?: string;
  data?: ApiPageCta;
}

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/works",
  "/industries",
  "/process",
  "/what-we-build",
] as const;

function invalidatePageCtas(): void {
  updateTag(PAGE_CTA_TAG);
  for (const path of PUBLIC_PATHS) revalidatePath(path);
  revalidatePath("/industries/[slug]", "page");
  revalidatePath("/marketing/industries/[slug]", "page");
  revalidatePath("/admin/page-ctas");
}

function errorMessage(error: unknown): string {
  unstable_rethrow(error);
  if (error instanceof ApiError) {
    if (error.body?.errorSources?.length) {
      return error.body.errorSources
        .map((source) => `${source.path}: ${source.message}`)
        .join(" · ");
    }
    return error.message;
  }
  return error instanceof Error ? error.message : "Save failed";
}

function sanitize(payload: PageCtaInput): PageCtaInput {
  return {
    ...payload,
    eyebrow: payload.eyebrow?.trim() ?? "",
    title: payload.title.trim(),
    description: payload.description.trim(),
    image: payload.image.trim(),
    primary_cta: {
      label: payload.primary_cta.label.trim(),
      href: payload.primary_cta.href.trim(),
    },
    secondary_cta: payload.secondary_cta
      ? {
          label: payload.secondary_cta.label.trim(),
          href: payload.secondary_cta.href.trim(),
        }
      : null,
  };
}

export async function savePageCtaAction(
  payload: PageCtaInput,
): Promise<PageCtaActionResult> {
  try {
    const response = await apiFetch<ApiPageCta>("/api/page-ctas/upsert", {
      method: "PUT",
      body: sanitize(payload),
    });
    invalidatePageCtas();
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function deletePageCtaAction(
  id: string,
): Promise<PageCtaActionResult> {
  try {
    await apiFetch(`/api/page-ctas/${id}`, { method: "DELETE" });
    invalidatePageCtas();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
