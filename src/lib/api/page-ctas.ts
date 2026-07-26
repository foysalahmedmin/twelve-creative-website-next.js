import { unstable_rethrow } from "next/navigation";
import { HOME_CTA_DATA } from "@/data/home-cta.data";
import {
  CTA_ABOUT,
  CTA_INDUSTRIES,
  CTA_PROCESS,
  CTA_WHAT_WE_BUILD,
  CTA_WORKS,
} from "@/data/page-ctas.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { IndustrySummary } from "./industries";

export const PAGE_CTA_TAG = "page-ctas";

export const PAGE_CTA_PLACEMENTS = [
  "home",
  "about",
  "works",
  "industries",
  "process",
  "what-we-build",
  "industry-detail",
] as const;

export type PageCtaPlacement = (typeof PAGE_CTA_PLACEMENTS)[number];

export const PAGE_CTA_LABELS: Record<PageCtaPlacement, string> = {
  home: "Home",
  about: "About",
  works: "Works",
  industries: "Industries",
  process: "Process",
  "what-we-build": "What We Build",
  "industry-detail": "Industry Detail",
};

export interface PageCtaLink {
  label: string;
  href: string;
}

export interface ApiPageCta {
  _id?: string;
  placement: PageCtaPlacement;
  industry: IndustrySummary | string | null;
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  primary_cta: PageCtaLink;
  secondary_cta?: PageCtaLink | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type PageCtaInput = Omit<
  ApiPageCta,
  "_id" | "industry" | "created_at" | "updated_at"
> & {
  industry: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  return clean && clean.length <= maxLength ? clean : null;
}

function isSafePath(value: string): boolean {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return false;
  }
  try {
    return !decodeURIComponent(value.split(/[?#]/, 1)[0])
      .split("/")
      .includes("..");
  } catch {
    return false;
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
}

function isSafeImage(value: string): boolean {
  return isSafePath(value) || isHttpUrl(value);
}

function isSafeLink(value: string): boolean {
  return (
    isSafePath(value) ||
    isHttpUrl(value) ||
    /^#[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value) ||
    /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    /^tel:\+?[0-9(). -]{5,30}$/.test(value)
  );
}

function normalizeLink(value: unknown): PageCtaLink | null {
  if (!isRecord(value)) return null;
  const label = cleanString(value.label, 80);
  const href = cleanString(value.href, 2048);
  return label && href && isSafeLink(href) ? { label, href } : null;
}

function normalizeIndustry(value: unknown): IndustrySummary | string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value))
    return value;
  if (!isRecord(value)) return null;
  const id = cleanString(value._id, 24);
  const name = cleanString(value.name, 80);
  const slug = cleanString(value.slug, 80);
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id) || !name || !slug) return null;
  return {
    _id: id,
    name,
    slug,
    order: typeof value.order === "number" ? value.order : 0,
    is_active: value.is_active !== false,
  };
}

export function normalizePageCta(value: unknown): ApiPageCta | null {
  if (!isRecord(value)) return null;
  const placement = cleanString(value.placement, 40);
  if (!PAGE_CTA_PLACEMENTS.includes(placement as PageCtaPlacement)) return null;
  const title = cleanString(value.title, 300);
  const description = cleanString(value.description, 1200);
  const image = cleanString(value.image, 2048);
  const primary = normalizeLink(value.primary_cta);
  if (!title || !description || !image || !isSafeImage(image) || !primary) {
    return null;
  }
  const secondary =
    value.secondary_cta === null || value.secondary_cta === undefined
      ? null
      : normalizeLink(value.secondary_cta);
  if (value.secondary_cta && !secondary) return null;

  const normalized: ApiPageCta = {
    placement: placement as PageCtaPlacement,
    industry: normalizeIndustry(value.industry),
    title,
    description,
    image,
    primary_cta: primary,
    secondary_cta: secondary,
    is_active: value.is_active !== false,
  };
  const eyebrow = cleanString(value.eyebrow, 80);
  if (eyebrow) normalized.eyebrow = eyebrow;
  for (const key of ["_id", "created_at", "updated_at"] as const) {
    if (typeof value[key] === "string") normalized[key] = value[key];
  }
  return normalized;
}

function fromLegacy(
  placement: PageCtaPlacement,
  cta: {
    title: string;
    description: string;
    image: string;
    href: string;
    buttonText: string;
  },
): ApiPageCta {
  return {
    placement,
    industry: null,
    title: cta.title,
    description: cta.description,
    image: cta.image,
    primary_cta: { label: cta.buttonText, href: cta.href },
    secondary_cta: null,
    is_active: true,
  };
}

export const PAGE_CTA_FALLBACKS: Record<PageCtaPlacement, ApiPageCta> = {
  home: {
    placement: "home",
    industry: null,
    eyebrow: HOME_CTA_DATA.eyebrow,
    title: HOME_CTA_DATA.title,
    description: HOME_CTA_DATA.description,
    image: CTA_WHAT_WE_BUILD.image,
    primary_cta: HOME_CTA_DATA.primary_cta,
    secondary_cta: HOME_CTA_DATA.secondary_cta,
    is_active: true,
  },
  about: fromLegacy("about", CTA_ABOUT),
  works: fromLegacy("works", CTA_WORKS),
  industries: fromLegacy("industries", CTA_INDUSTRIES),
  process: fromLegacy("process", CTA_PROCESS),
  "what-we-build": fromLegacy("what-we-build", CTA_WHAT_WE_BUILD),
  "industry-detail": fromLegacy("industry-detail", CTA_ABOUT),
};

export function clonePageCta(cta: ApiPageCta): ApiPageCta {
  return {
    ...cta,
    primary_cta: { ...cta.primary_cta },
    secondary_cta: cta.secondary_cta ? { ...cta.secondary_cta } : null,
  };
}

export async function getPublicPageCta(
  placement: PageCtaPlacement,
  options: { industrySlug?: string } = {},
): Promise<ApiPageCta | null> {
  try {
    const params = new URLSearchParams();
    if (options.industrySlug) params.set("industry_slug", options.industrySlug);
    const query = params.toString();
    const response = await apiFetch<unknown>(
      `/api/page-ctas/public/${placement}${query ? `?${query}` : ""}`,
      {
        method: "GET",
        auth: false,
        revalidate: 300,
        tags: [PAGE_CTA_TAG, `${PAGE_CTA_TAG}-${placement}`],
      },
    );
    // Public endpoints deliberately return a successful `null` for an
    // inactive/missing CTA. Preserve that visibility decision rather than
    // resurrecting static copy. Built-ins are only for transport/API failure.
    if (response.data === null || response.data === undefined) return null;
    const normalized = normalizePageCta(response.data);
    return normalized?.is_active === false ? null : normalized;
  } catch {
    return clonePageCta(PAGE_CTA_FALLBACKS[placement]);
  }
}

export async function getAdminPageCtas(
  filters: {
    placement?: PageCtaPlacement;
    industry?: string;
  } = {},
): Promise<ApiPageCta[]> {
  const params = new URLSearchParams();
  if (filters.placement) params.set("placement", filters.placement);
  if (filters.industry) params.set("industry", filters.industry);
  const query = params.toString();
  const response = await apiFetch<unknown>(
    `/api/page-ctas${query ? `?${query}` : ""}`,
  );
  if (!Array.isArray(response.data)) {
    throw new ApiError(502, "Page CTA list returned malformed data", null);
  }
  return response.data.map((item) => {
    const normalized = normalizePageCta(item);
    if (!normalized) {
      throw new ApiError(502, "A saved Page CTA is malformed", null);
    }
    return normalized;
  });
}

export async function getAdminPageCtaScope(
  placement: PageCtaPlacement,
  industryId?: string,
): Promise<ApiPageCta | null> {
  try {
    const records = await getAdminPageCtas({ placement, industry: industryId });
    return (
      records.find((record) => {
        const recordIndustry =
          typeof record.industry === "string"
            ? record.industry
            : record.industry?._id;
        return industryId ? recordIndustry === industryId : !recordIndustry;
      }) ?? null
    );
  } catch (error) {
    unstable_rethrow(error);
    throw error;
  }
}

export function toLegacyPageCta(cta: ApiPageCta) {
  return {
    eyebrow: cta.eyebrow,
    title: cta.title,
    description: cta.description,
    image: cta.image,
    href: cta.primary_cta.href,
    buttonText: cta.primary_cta.label,
    secondaryCta: cta.secondary_cta ?? null,
  };
}
