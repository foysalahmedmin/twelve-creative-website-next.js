"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { TProcessIconKey } from "@/data/process.data";
import { PROCESS_SECTION_TAG, type ApiProcessSection } from "./process-section";

export interface ProcessStepInput {
  id: string;
  icon: TProcessIconKey;
  title: string;
  description: string;
  image: string;
}

export interface ProcessSectionInput {
  label: string;
  title: string;
  description: string;
  thumbnail: string;
  process_steps: ProcessStepInput[];
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

function invalidateProcessSection(): void {
  updateTag(PROCESS_SECTION_TAG);
  revalidatePath("/admin/process-section");
  revalidatePath("/");
  revalidatePath("/process");
  revalidatePath("/what-we-build");
  revalidatePath("/canvus");
  revalidatePath("/industries/[slug]", "page");
  revalidatePath("/marketing/industries/[slug]", "page");
}

function sanitize(payload: ProcessSectionInput): ProcessSectionInput {
  return {
    label: payload.label.trim(),
    title: payload.title.trim(),
    description: payload.description.trim(),
    thumbnail: payload.thumbnail.trim(),
    process_steps: payload.process_steps.map((step) => ({
      id: step.id.trim(),
      icon: step.icon,
      title: step.title.trim(),
      description: step.description.trim(),
      image: step.image.trim(),
    })),
  };
}

function errorMessage(error: unknown): string {
  unstable_rethrow(error);
  if (error instanceof ApiError) {
    const sources = error.body?.errorSources;
    if (sources?.length) {
      return sources
        .map((source) => `${source.path}: ${source.message}`)
        .join(" · ");
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Save failed";
}

export async function updateProcessSectionAction(
  payload: ProcessSectionInput,
): Promise<ActionResult<ApiProcessSection>> {
  try {
    const response = await apiFetch<ApiProcessSection>("/api/process-section", {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidateProcessSection();
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
