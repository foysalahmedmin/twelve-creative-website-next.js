import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getFeaturedProjectById } from "@/lib/api/featured-projects";
import { FeaturedProjectForm } from "../../featured-project-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturedProjectPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const project = await getFeaturedProjectById(id);
    return (
      <FeaturedProjectForm
        mode="edit"
        initial={project}
      />
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
