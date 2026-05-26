import { apiFetch } from "@/lib/admin/api-client";

export const BOOKINGS_TAG = "bookings";

export type BookingStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  timeline?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status: BookingStatus;
  internal_note?: string;
  source: "booking_form";
  created_at: string;
  updated_at: string;
}

export async function getAdminBookings(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: BookingStatus;
} = {}): Promise<{
  data: Booking[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<Booking[]>(`/api/booking${qs ? `?${qs}` : ""}`);
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await apiFetch<Booking>(`/api/booking/${id}`);
  return res.data;
}

export async function getPendingBookingCount(): Promise<number> {
  try {
    const res = await apiFetch<{ count: number }>("/api/booking/pending-count");
    return res.data?.count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Client-side helper for public booking submission. No auth, server proxy isn't
 * required because the backend endpoint accepts unauthenticated POSTs.
 */
export interface PublicBookingPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  preferred_date?: string; // ISO date
  preferred_time?: string;
  message?: string;
}
