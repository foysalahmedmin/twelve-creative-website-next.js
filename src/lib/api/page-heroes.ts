import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { ApiError } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";
import { unstable_rethrow } from "next/navigation";
import type { PageKey } from "./page-heroes.constants";
import { PAGE_HERO_TAG } from "./page-heroes.constants";
export { PAGE_HERO_TAG, PAGE_KEYS, PAGE_LABELS } from "./page-heroes.constants";
export type { PageKey } from "./page-heroes.constants";

export interface ApiPageHero {
  _id?: string;
  page: PageKey;
  label?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  video?: VideoRef & { poster?: string };
  trust_label?: string;
  primary_cta?: { label: string; href: string };
  secondary_cta?: { label: string; href: string };
  seo?: {
    title?: string;
    description?: string;
    og_image?: string;
    canonical_url?: string;
    no_index?: boolean;
  };
  is_active: boolean;
  updated_at?: string;
}

export function resolvePageMetadata(
  hero: ApiPageHero | null,
  fallback: { title: string; description: string },
) {
  const title = hero?.seo?.title?.trim() || fallback.title;
  const description = hero?.seo?.description?.trim() || fallback.description;
  const ogImage = hero?.seo?.og_image?.trim();
  const canonical = hero?.seo?.canonical_url?.trim();

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(hero?.seo?.no_index ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export async function getPublicPageHero(
  page: PageKey,
): Promise<ApiPageHero | null> {
  try {
    const res = await apiFetch<ApiPageHero>(`/api/page-hero/public/${page}`, {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [PAGE_HERO_TAG, `${PAGE_HERO_TAG}-${page}`],
    });
    const hero = res.data;
    if (!hero || hero.is_active === false) return null;
    return hero;
  } catch {
    return null;
  }
}

export async function getAdminPageHeroes(): Promise<ApiPageHero[]> {
  const res = await apiFetch<ApiPageHero[]>("/api/page-hero");
  return res.data ?? [];
}

export async function getAdminPageHero(
  page: PageKey,
): Promise<ApiPageHero | null> {
  try {
    const res = await apiFetch<ApiPageHero>(`/api/page-hero/${page}`);
    return res.data ?? null;
  } catch (error) {
    // Keep a genuinely missing record distinct from an unavailable admin API.
    // The editor can create a missing record, while operational/auth failures
    // must reach the nearest error boundary instead of looking like empty data.
    unstable_rethrow(error);
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function resolveVideoSrc(
  video: (VideoRef & { poster?: string }) | null | undefined,
): string | undefined {
  return video?.value || undefined;
}

export function resolveThumbnail(
  thumbnail: string | undefined,
  video: (VideoRef & { poster?: string }) | null | undefined,
): string | undefined {
  if (thumbnail) return thumbnail;
  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return undefined;
}
