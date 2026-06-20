"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type { AdminRole } from "@/lib/admin/types";
import type { AdminAccount } from "./admin-users";

export interface AdminAccountCreate {
  name: string;
  email: string;
  password: string;
}

export interface AdminAccountUpdate {
  name?: string;
  email?: string;
  role?: AdminRole;
  status?: "in-progress" | "blocked";
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  revalidatePath("/admin/users");
};

export async function createAdminAccountAction(
  payload: AdminAccountCreate,
): Promise<ActionResult<AdminAccount>> {
  try {
    const res = await apiFetch<AdminAccount>("/api/auth/signup", {
      method: "POST",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateAdminAccountAction(
  id: string,
  payload: AdminAccountUpdate,
): Promise<ActionResult<AdminAccount>> {
  try {
    // Backend PATCH /api/user/:id accepts multipart for image upload; for
    // simple field updates we send JSON which the validator accepts too.
    const res = await apiFetch<AdminAccount>(`/api/user/${id}`, {
      method: "PATCH",
      body: payload,
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteAdminAccountAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/user/${id}`, { method: "DELETE" });
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
