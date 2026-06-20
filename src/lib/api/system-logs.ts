import { apiFetch } from "@/lib/admin/api-client";

export type SystemLogLevel = "info" | "warn" | "error";

export interface SystemLog {
  _id: string;
  level: SystemLogLevel;
  message: string;
  actor?: string;
  meta?: Record<string, unknown>;
  created_at: string;
}

export async function getSystemLogs(query: {
  page?: number;
  limit?: number;
  level?: SystemLogLevel;
} = {}): Promise<{
  data: SystemLog[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.level) params.set("level", query.level);
  const qs = params.toString();
  const res = await apiFetch<SystemLog[]>(`/api/system-log${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as { total: number; page: number; limit: number; total_pages: number } | undefined,
  };
}
