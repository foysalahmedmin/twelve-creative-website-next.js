"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { TICKETS_TAG, type Ticket, type TicketPriority, type TicketStatus } from "./tickets";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  revalidatePath("/admin/tech-ops/support-tickets");
};

export async function createTicketAction(payload: {
  title: string;
  description?: string;
  priority?: TicketPriority;
}): Promise<ActionResult<Ticket>> {
  try {
    const res = await apiFetch<Ticket>("/api/ticket", { method: "POST", body: payload });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateTicketAction(
  id: string,
  payload: { title?: string; description?: string | null; priority?: TicketPriority; status?: TicketStatus },
): Promise<ActionResult<Ticket>> {
  try {
    const res = await apiFetch<Ticket>(`/api/ticket/${id}`, { method: "PATCH", body: payload });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteTicketAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/ticket/${id}`, { method: "DELETE" });
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
