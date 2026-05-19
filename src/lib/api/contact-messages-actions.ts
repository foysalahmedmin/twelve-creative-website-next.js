"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { ApiError, type ApiResponse } from "@/lib/admin/types";
import {
  CONTACT_MESSAGES_TAG,
  type ContactMessage,
  type PublicContactMessagePayload,
} from "./contact-messages";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(CONTACT_MESSAGES_TAG);
  revalidatePath("/admin/messages");
};

/** Public — no auth, used by the contact form. */
export async function submitContactMessageAction(
  payload: PublicContactMessagePayload,
): Promise<ActionResult> {
  try {
    const res = await fetch(
      `${ADMIN_CONFIG.apiUrl}/api/contact-message/public`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
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
          "Could not send your message.",
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

export async function updateContactMessageAction(
  id: string,
  payload: { is_read?: boolean; is_archived?: boolean },
): Promise<ActionResult<ContactMessage>> {
  try {
    const res = await apiFetch<ContactMessage>(
      `/api/contact-message/${id}`,
      {
        method: "PATCH",
        body: payload,
      },
    );
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteContactMessageAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/contact-message/${id}`, { method: "DELETE" });
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
