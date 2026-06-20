"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  TEAM_MEMBERS_TAG,
  type TeamMember,
  type TeamMemberSocials,
} from "./team-members";

export interface TeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  image: string;
  socials?: TeamMemberSocials;
  order?: number;
  is_active?: boolean;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

const invalidate = () => {
  updateTag(TEAM_MEMBERS_TAG);
  revalidatePath("/admin/team");
};

export async function createTeamMemberAction(
  payload: TeamMemberInput,
): Promise<ActionResult<TeamMember>> {
  try {
    const res = await apiFetch<TeamMember>("/api/team-member", {
      method: "POST",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateTeamMemberAction(
  id: string,
  payload: Partial<TeamMemberInput>,
): Promise<ActionResult<TeamMember>> {
  try {
    const res = await apiFetch<TeamMember>(`/api/team-member/${id}`, {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteTeamMemberAction(
  id: string,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/team-member/${id}`, { method: "DELETE" });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function toggleTeamMemberActiveAction(
  id: string,
  is_active: boolean,
): Promise<ActionResult> {
  try {
    await apiFetch(`/api/team-member/${id}`, {
      method: "PATCH",
      body: { is_active },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function reorderTeamMembersAction(
  items: { _id: string; order: number }[],
): Promise<ActionResult> {
  try {
    await apiFetch("/api/team-member/reorder", {
      method: "POST",
      body: { items },
    });
    invalidate();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function sanitize<T extends Partial<TeamMemberInput>>(input: T): T {
  const out = { ...input } as T;
  if (out.bio === "") delete (out as { bio?: unknown }).bio;
  return out;
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
