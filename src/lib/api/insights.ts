import { apiFetch } from "@/lib/admin/api-client";

export const INSIGHTS_TAG = "insights";

export interface Insight {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string;
  category?: string;
  read_minutes?: number;
  author?: string;
  status: "draft" | "published";
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getPublicInsights(): Promise<Insight[]> {
  try {
    const res = await apiFetch<Insight[]>("/api/insight/public", {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [INSIGHTS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicInsightBySlug(
  slug: string,
): Promise<Insight | null> {
  try {
    const res = await apiFetch<Insight>(`/api/insight/public/${slug}`, {
      method: "GET",
      auth: false,
      revalidate: 60,
      tags: [INSIGHTS_TAG, `insight:${slug}`],
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function getAdminInsights(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "published" | "draft";
} = {}): Promise<{
  data: Insight[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<Insight[]>(`/api/insight${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getInsightById(id: string): Promise<Insight> {
  const res = await apiFetch<Insight>(`/api/insight/${id}`);
  return res.data;
}
