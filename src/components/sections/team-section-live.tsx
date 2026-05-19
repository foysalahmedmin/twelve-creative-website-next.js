/**
 * Server wrapper for TeamSection: fetches admin-managed team members and
 * adapts them to the legacy {name, designation, photourl} shape. Falls back
 * to static ABOUT_TEAM_DATA when the API returns nothing.
 */

import { TeamSection } from "@/components/sections/team-section";
import type { TeamSectionItem } from "@/components/sections/team-section";
import { getPublicTeamMembers } from "@/lib/api/team-members";

export async function LiveTeamSection() {
  const members = await getPublicTeamMembers();
  if (!members.length) return <TeamSection />;
  const data: TeamSectionItem[] = members.map((m) => ({
    name: m.name,
    designation: m.role,
    photourl: m.image,
  }));
  return <TeamSection data={data} />;
}
