"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { ApiError, type ApiResponse } from "@/lib/admin/types";
import {
  BOOKINGS_TAG,
  type Booking,
  type BookingStatus,
  type LeadSource,
  type PublicBookingPayload,
} from "./bookings";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(BOOKINGS_TAG);
  revalidatePath("/admin/bookings");
};

/** Public — no auth, used by the booking modal. */
export async function submitBookingAction(
  payload: PublicBookingPayload,
): Promise<ActionResult> {
  try {
    const res = await fetch(`${ADMIN_CONFIG.apiUrl}/api/booking/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => null)) as
      | ApiResponse
      | { success: false; message?: string }
      | null;
    if (!json) return { ok: false, error: "Invalid server response." };
    if (!res.ok || json.success === false) {
      return {
        ok: false,
        error:
          (json as { message?: string }).message ||
          "Could not submit your booking.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Check your connection.",
    };
  }
}

export async function updateBookingAction(
  id: string,
  payload: { status?: BookingStatus; internal_note?: string; lead_source?: LeadSource | null },
): Promise<ActionResult<Booking>> {
  try {
    const res = await apiFetch<Booking>(`/api/booking/${id}`, {
      method: "PATCH",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteBookingAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/booking/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    const sources = e.body?.errorSources;
    if (sources && sources.length) {
      return sources.map((s) => `${s.path}: ${s.message}`).join(" · ");
    }
    return e.message;
  }
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
