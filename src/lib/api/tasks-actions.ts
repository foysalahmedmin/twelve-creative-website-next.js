"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import { type Task, type TaskPriority, type TaskStatus } from "./tasks";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  revalidatePath("/admin/tech-ops/tasks");
};

export async function createTaskAction(payload: {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
}): Promise<ActionResult<Task>> {
  try {
    const res = await apiFetch<Task>("/api/task", { method: "POST", body: payload });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateTaskAction(
  id: string,
  payload: { title?: string; description?: string | null; priority?: TaskPriority; status?: TaskStatus; due_date?: string | null },
): Promise<ActionResult<Task>> {
  try {
    const res = await apiFetch<Task>(`/api/task/${id}`, { method: "PATCH", body: payload });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteTaskAction(id: string): Promise<ActionResult> {
  try {
    await apiFetch(`/api/task/${id}`, { method: "DELETE" });
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
