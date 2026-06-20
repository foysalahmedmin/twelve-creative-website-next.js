import { apiFetch } from "@/lib/admin/api-client";

export const TASKS_TAG = "tasks";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function getAdminTasks(query: {
  search?: string;
  page?: number;
  limit?: number;
  status?: TaskStatus;
} = {}): Promise<{
  data: Task[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.status) params.set("status", query.status);
  const qs = params.toString();
  const res = await apiFetch<Task[]>(`/api/task${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as { total: number; page: number; limit: number; total_pages: number } | undefined,
  };
}

export async function getTaskById(id: string): Promise<Task> {
  const res = await apiFetch<Task>(`/api/task/${id}`);
  return res.data;
}
