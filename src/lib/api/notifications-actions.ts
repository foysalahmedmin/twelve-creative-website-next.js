"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { NOTIFICATIONS_TAG } from "./notifications";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function invalidate() {
  updateTag(NOTIFICATIONS_TAG);
  revalidatePath("/admin", "layout");
}

export async function markNotificationReadAction(
  id: string,
  is_read: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/notification-recipient/${id}/self`, {
      method: "PATCH",
      body: { is_read },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  try {
    await apiFetch("/api/notification-recipient/read-all/self", {
      method: "PATCH",
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function errorMessage(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error) return e.message;
  return "Something went wrong";
}
