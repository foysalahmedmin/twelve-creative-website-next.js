import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { getWorkById } from "@/lib/api/works";
import { WorkForm } from "../../work-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkPage({ params }: PageProps) {
  const { id } = await params;

  const [workResult, industries] = await Promise.all([
    loadWork(id),
    loadIndustryOptions(),
  ]);

  if (workResult.error) {
    if (
      workResult.error instanceof ApiError &&
      workResult.error.status === 404
    ) {
      notFound();
    }
    throw workResult.error;
  }

  return (
    <WorkForm
      mode="edit"
      initial={workResult.data}
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}

async function loadWork(id: string) {
  try {
    return { data: await getWorkById(id), error: undefined };
  } catch (error) {
    return { data: undefined, error };
  }
}
