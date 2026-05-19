import { apiFetch } from "@/lib/admin/api-client";

export const CONTACT_MESSAGES_TAG = "contact-messages";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicContactMessagePayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function getAdminContactMessages(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "unread" | "read" | "archived";
} = {}): Promise<{
  data: ContactMessage[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<ContactMessage[]>(
    `/api/contact-message${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getContactMessageById(
  id: string,
): Promise<ContactMessage> {
  const res = await apiFetch<ContactMessage>(`/api/contact-message/${id}`);
  return res.data;
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const res = await apiFetch<{ count: number }>(
      "/api/contact-message/unread-count",
    );
    return res.data?.count ?? 0;
  } catch {
    return 0;
  }
}
