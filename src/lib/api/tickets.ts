import { apiFetch } from "@/lib/admin/api-client";

export const TICKETS_TAG = "tickets";

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  _id: string;
  title: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function getAdminTickets(query: {
  search?: string;
  page?: number;
  limit?: number;
  status?: TicketStatus;
} = {}): Promise<{
  data: Ticket[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.status) params.set("status", query.status);
  const qs = params.toString();
  const res = await apiFetch<Ticket[]>(`/api/ticket${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as { total: number; page: number; limit: number; total_pages: number } | undefined,
  };
}

export async function getTicketById(id: string): Promise<Ticket> {
  const res = await apiFetch<Ticket>(`/api/ticket/${id}`);
  return res.data;
}
