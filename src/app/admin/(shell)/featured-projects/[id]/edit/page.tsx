import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getFeaturedProjectById } from "@/lib/api/featured-projects";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { FeaturedProjectForm } from "../../featured-project-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturedProjectPage({ params }: PageProps) {
  const { id } = await params;
  const [projectResult, industries] = await Promise.all([
    loadFeaturedProject(id),
    loadIndustryOptions(),
  ]);

  if (projectResult.error) {
    if (
      projectResult.error instanceof ApiError &&
      projectResult.error.status === 404
    ) {
      notFound();
    }
    throw projectResult.error;
  }

  return (
    <FeaturedProjectForm
      mode="edit"
      initial={projectResult.data}
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}

async function loadFeaturedProject(id: string) {
  try {
    return { data: await getFeaturedProjectById(id), error: undefined };
  } catch (error) {
    return { data: undefined, error };
  }
}
