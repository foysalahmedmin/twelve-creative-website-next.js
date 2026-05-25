import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { PAGE_HERO_TAG } from "./page-heroes.constants";
import type { PageKey } from "./page-heroes.constants";
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
  is_active: boolean;
  updated_at?: string;
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
  try {
    const res = await apiFetch<ApiPageHero[]>("/api/page-hero");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminPageHero(
  page: PageKey,
): Promise<ApiPageHero | null> {
  try {
    const res = await apiFetch<ApiPageHero>(`/api/page-hero/${page}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

/** Resolves a VideoRef to a plain URL string for react-player / PageHeader. */
export function resolveVideoSrc(
  video: (VideoRef & { poster?: string }) | null | undefined,
): string | undefined {
  return video?.value || undefined;
}

/** Extracts a YouTube video ID from various YouTube URL formats. */
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

/**
 * Resolves the thumbnail for a page hero with priority:
 * 1. Manually set thumbnail (always wins)
 * 2. YouTube video → auto-extract hqdefault.jpg
 * 3. undefined (no thumbnail)
 */
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
