"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  LEGAL_PAGES_TAG,
  type AdminLegalPage,
  type LegalPageSlug,
} from "./legal-pages";

export interface LegalPageInput {
  slug: LegalPageSlug;
  title: string;
  markdown: string;
  effective_date: string | null;
  seo: {
    title: string;
    description: string;
  };
  is_published: boolean;
}

export interface LegalPageActionResult {
  ok: boolean;
  error?: string;
  data?: AdminLegalPage;
}

function sanitize(payload: LegalPageInput): LegalPageInput {
  return {
    slug: payload.slug,
    title: payload.title.trim(),
    markdown: payload.markdown.replace(/\r\n?/g, "\n").trim(),
    effective_date: payload.effective_date || null,
    seo: {
      title: payload.seo.title.trim(),
      description: payload.seo.description.trim(),
    },
    is_published: payload.is_published,
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

export async function updateLegalPageAction(
  slug: LegalPageSlug,
  payload: LegalPageInput,
): Promise<LegalPageActionResult> {
  if (slug !== payload.slug) {
    return { ok: false, error: "Route and Legal page slugs must match" };
  }
  try {
    const response = await apiFetch<AdminLegalPage>(
      `/api/legal-pages/${slug}`,
      {
        method: "PUT",
        body: sanitize(payload),
      },
    );
    updateTag(LEGAL_PAGES_TAG);
    updateTag(`${LEGAL_PAGES_TAG}:${slug}`);
    revalidatePath(`/${slug}`);
    revalidatePath("/admin/legal-pages");
    revalidatePath(`/admin/legal-pages/${slug}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}
