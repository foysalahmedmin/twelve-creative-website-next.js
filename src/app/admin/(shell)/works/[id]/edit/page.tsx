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
  try {
    const work = await getWorkById(id);
    return <WorkForm mode="edit" initial={work} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
