/**
 * Public + admin readers for testimonials.
 *
 * Public reader is used by RSC pages and tagged so admin mutations can
 * invalidate it with `revalidateTag('testimonials')`.
 *
 * Two public shapes are exported:
 *   - `Testimonial` — the raw backend shape (nested video_message).
 *   - via `getPublicTestimonialsForSection()` — flattened to match the legacy
 *     `TTestimonial` shape that `TestimonialSection` already consumes, so the
 *     section doesn't have to change.
 */

import type { TTestimonial, TTestimonialData } from "@/data/testimonials.data";
import { apiFetch } from "@/lib/admin/api-client";
import type { VideoRef } from "@/lib/admin/types";
import { extractYouTubeId } from "@/lib/media/video";

export const TESTIMONIALS_TAG = "testimonials";

export type TestimonialCategory = "message" | "video_message";

export interface Testimonial {
  _id: string;
  name: string;
  designation: string;
  image: string;
  category: TestimonialCategory;
  message?: string;
  video_message?: VideoRef;
  thumbnail?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/** Public read — only active testimonials, sorted by order. */
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await apiFetch<Testimonial[]>("/api/testimonial/public", {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [TESTIMONIALS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

/** Admin list — paginated, requires auth cookie. */
export async function getAdminTestimonials(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: Testimonial[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<Testimonial[]>(
    `/api/testimonial${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getTestimonialById(id: string): Promise<Testimonial> {
  const res = await apiFetch<Testimonial>(`/api/testimonial/${id}`);
  return res.data;
}

/**
 * Returns the legacy-shaped data the existing `TestimonialSection` consumes,
 * so the public site swap is a no-op for the section component.
 */
export async function getPublicTestimonialsForSection(
  defaults: Pick<TTestimonialData, "label" | "title" | "description">,
): Promise<TTestimonialData> {
  const items = await getPublicTestimonials();
  return {
    ...defaults,
    testimonials: items.map(adaptForSection),
  };
}

function adaptForSection(t: Testimonial): TTestimonial {
  return {
    id: t._id,
    name: t.name,
    designation: t.designation,
    image: t.image,
    category: t.category,
    message: t.message,
    video_message: t.video_message?.value,
    thumbnail: resolvePoster(t.video_message, t.thumbnail),
  };
}

function resolvePoster(video?: VideoRef, thumbnail?: string): string | undefined {
  if (thumbnail) return thumbnail;
  if (video?.source === "youtube") {
    const id = extractYouTubeId(video.value);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return undefined;
}
