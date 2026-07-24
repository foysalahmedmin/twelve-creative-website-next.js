import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getTeamMemberById } from "@/lib/api/team-members";
import { TeamForm } from "../../team-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const { id } = await params;

  let member: Awaited<ReturnType<typeof getTeamMemberById>>;
  try {
    member = await getTeamMemberById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return <TeamForm mode="edit" initial={member} />;
}
