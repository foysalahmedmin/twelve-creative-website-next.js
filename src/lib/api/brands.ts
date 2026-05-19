import { apiFetch } from "@/lib/admin/api-client";

export const BRANDS_TAG = "brands";

export interface Brand {
  _id: string;
  name: string;
  logo: string;
  href?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicBrands(): Promise<Brand[]> {
  try {
    const res = await apiFetch<Brand[]>("/api/brand/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [BRANDS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminBrands(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: Brand[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<Brand[]>(`/api/brand${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getBrandById(id: string): Promise<Brand> {
  const res = await apiFetch<Brand>(`/api/brand/${id}`);
  return res.data;
}
