/**
 * Public + admin readers for Services.
 *
 * Services drive two UI surfaces:
 *  - Home page `ServicesSection` (card grid)
 *  - `/what-we-build` `AlternatingServicesSection` (L/R rows)
 *
 * Anchor links use the slug as a fragment: `/what-we-build#<slug>`.
 */

import type { TService, TServiceIconKey } from "@/data/services.data";
import { apiFetch } from "@/lib/admin/api-client";

export const SERVICES_TAG = "services";

export interface ApiService {
  _id: string;
  slug: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
  icon: TServiceIconKey;
  href?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicServices(): Promise<ApiService[]> {
  try {
    const res = await apiFetch<ApiService[]>("/api/service/public", {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [SERVICES_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminServices(
  query: {
    search?: string;
    page?: number;
    limit?: number;
    filter?: "active" | "inactive";
  } = {},
): Promise<{
  data: ApiService[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<ApiService[]>(
    `/api/service${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getServiceById(id: string): Promise<ApiService> {
  const res = await apiFetch<ApiService>(`/api/service/${id}`);
  return res.data;
}

/**
 * Adapts the API shape into the legacy `TService[]` the existing
 * `ServicesSection` / `ServiceCard` / `AlternatingServicesSection` already
 * consume, so swapping in live data needs no component refactor.
 */
export function toLegacyServices(items: ApiService[]): TService[] {
  return items.map((s) => ({
    id: s.slug,
    icon: s.icon,
    title: s.title,
    description: s.description,
    highlights: s.highlights ?? [],
    thumbnail_src: s.image,
    href: s.href && s.href.trim() ? s.href : `/what-we-build#${s.slug}`,
  }));
}

export async function getPublicServicesAsLegacy(): Promise<TService[]> {
  const items = await getPublicServices();
  return toLegacyServices(items);
}
