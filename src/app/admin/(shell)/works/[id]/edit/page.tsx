import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getWorkById } from "@/lib/api/works";
import { WorkForm } from "../../work-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: PageProps) {
  const { id } = await params;

  let work: Awaited<ReturnType<typeof getWorkById>>;
  try {
    work = await getWorkById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return <WorkForm mode="edit" initial={work} />;
}
