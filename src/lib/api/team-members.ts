import { apiFetch } from "@/lib/admin/api-client";

export const TEAM_MEMBERS_TAG = "team-members";

export interface TeamMemberSocials {
  linkedin?: string;
  instagram?: string;
  x?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  image: string;
  socials?: TeamMemberSocials;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPublicTeamMembers(): Promise<TeamMember[]> {
  try {
    const res = await apiFetch<TeamMember[]>("/api/team-member/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [TEAM_MEMBERS_TAG],
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

export async function getAdminTeamMembers(query: {
  search?: string;
  page?: number;
  limit?: number;
  filter?: "active" | "inactive";
} = {}): Promise<{
  data: TeamMember[];
  meta?: { total: number; page: number; limit: number; total_pages: number };
}> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.filter) params.set("filter", query.filter);

  const qs = params.toString();
  const res = await apiFetch<TeamMember[]>(
    `/api/team-member${qs ? `?${qs}` : ""}`,
  );
  return {
    data: res.data ?? [],
    meta: res.meta as
      | { total: number; page: number; limit: number; total_pages: number }
      | undefined,
  };
}

export async function getTeamMemberById(id: string): Promise<TeamMember> {
  const res = await apiFetch<TeamMember>(`/api/team-member/${id}`);
  return res.data;
}
