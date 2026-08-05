import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  isLegalPageSlug,
  isSafeLegalMarkdown,
  LEGAL_PAGE_LABELS,
  type AdminLegalPage,
  type LegalPageSlug,
  type PublicLegalPage,
} from "./legal-page-shared";

export {
  isLegalPageSlug,
  isSafeLegalMarkdown,
  LEGAL_PAGE_LABELS,
  LEGAL_PAGE_SLUGS,
  type AdminLegalPage,
  type LegalPageSeo,
  type LegalPageSlug,
  type PublicLegalPage,
} from "./legal-page-shared";

export const LEGAL_PAGES_TAG = "legal-pages";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean && clean.length <= maxLength ? clean : null;
}

function normalizeDate(value: unknown): string | null | undefined {
  if (value === null) return null;
  if (typeof value !== "string") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function normalizeLegalPage(
  value: unknown,
  requireAdminFields: boolean,
): PublicLegalPage | AdminLegalPage | null {
  if (!isRecord(value) || !isLegalPageSlug(String(value.slug))) return null;
  const slug = value.slug as LegalPageSlug;
  const title = requiredString(value.title, 200);
  const markdown = requiredString(value.markdown, 50000);
  const effectiveDate = normalizeDate(value.effective_date);
  if (
    !title ||
    !markdown ||
    !isSafeLegalMarkdown(markdown) ||
    effectiveDate === undefined ||
    !isRecord(value.seo)
  ) {
    return null;
  }
  const seoTitle = requiredString(value.seo.title, 200);
  const seoDescription = requiredString(value.seo.description, 500);
  if (!seoTitle || !seoDescription) return null;

  const page: PublicLegalPage = {
    slug,
    title,
    markdown,
    effective_date: effectiveDate,
    seo: { title: seoTitle, description: seoDescription },
  };
  if (!requireAdminFields) return page;
  if (typeof value.is_published !== "boolean") return null;

  const admin: AdminLegalPage = {
    ...page,
    is_published: value.is_published,
  };
  if (typeof value._id === "string") admin._id = value._id;
  if (typeof value.created_at === "string") admin.created_at = value.created_at;
  if (typeof value.updated_at === "string") admin.updated_at = value.updated_at;
  return admin;
}

export function emptyLegalPage(slug: LegalPageSlug): AdminLegalPage {
  return {
    slug,
    title: LEGAL_PAGE_LABELS[slug],
    markdown: "",
    effective_date: null,
    seo: {
      title: `${LEGAL_PAGE_LABELS[slug]} | Twelve Creative`,
      description: "",
    },
    is_published: false,
  };
}

export async function getPublicLegalPage(
  slug: LegalPageSlug,
): Promise<PublicLegalPage | null> {
  try {
    const response = await apiFetch<unknown>(
      `/api/legal-pages/public/${slug}`,
      {
        method: "GET",
        auth: false,
        revalidate: 300,
        tags: [LEGAL_PAGES_TAG, `${LEGAL_PAGES_TAG}:${slug}`],
      },
    );
    if (response.data === null || response.data === undefined) return null;
    return normalizeLegalPage(response.data, false) as PublicLegalPage | null;
  } catch (error) {
    unstable_rethrow(error);
    // Every other public reader degrades to a fallback when the API is
    // unreachable; this one used to rethrow anything that was not a 404, so a
    // brief backend blip turned /privacy-policy and /terms-and-conditions into
    // 500s. Both pages already render a sane placeholder from `null`, and
    // these are footer/compliance links that should never hard-fail.
    if (error instanceof ApiError) {
      console.error(
        `Legal page "${slug}" unavailable (${error.status}); rendering placeholder.`,
      );
      return null;
    }
    throw error;
  }
}

export async function getAdminLegalPages(): Promise<AdminLegalPage[]> {
  const response = await apiFetch<unknown>("/api/legal-pages", {
    method: "GET",
  });
  if (!Array.isArray(response.data)) {
    throw new ApiError(502, "Legal pages response is malformed.", null);
  }
  const normalized = response.data.map((page) =>
    normalizeLegalPage(page, true),
  );
  if (normalized.some((page) => page === null)) {
    throw new ApiError(
      502,
      "One or more saved Legal pages are malformed. Please repair them through the API.",
      null,
    );
  }
  return normalized as AdminLegalPage[];
}

export async function getAdminLegalPage(
  slug: LegalPageSlug,
): Promise<AdminLegalPage | null> {
  try {
    const response = await apiFetch<unknown>(`/api/legal-pages/${slug}`, {
      method: "GET",
    });
    if (response.data === null || response.data === undefined) return null;
    const normalized = normalizeLegalPage(response.data, true);
    if (!normalized) {
      throw new ApiError(
        502,
        `Saved ${LEGAL_PAGE_LABELS[slug]} data is malformed.`,
        null,
      );
    }
    return normalized as AdminLegalPage;
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
