import { apiFetch } from "@/lib/admin/api-client";
import type { AdminRole } from "@/lib/admin/types";

export interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: AdminRole;
  status: "in-progress" | "blocked";
  is_verified: boolean;
  auth_source: "email" | "google";
  created_at?: string;
  updated_at?: string;
}

export async function getAdminAccounts(query: {
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  data: AdminAccount[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  const res = await apiFetch<AdminAccount[]>(`/api/user${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getAdminAccountById(id: string): Promise<AdminAccount> {
  const res = await apiFetch<AdminAccount>(`/api/user/${id}`);
  return res.data;
}
