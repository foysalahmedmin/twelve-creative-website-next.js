import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import {
  getAdminFeaturedProjects,
  getFeaturedProjectById,
} from "@/lib/api/featured-projects";
import { FeaturedProjectForm } from "../../featured-project-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturedProjectPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const [project, { data }] = await Promise.all([
      getFeaturedProjectById(id),
      getAdminFeaturedProjects({ limit: 200 }).catch(() => ({ data: [] })),
    ]);
    const categories = Array.from(new Set(data.map((p) => p.category))).sort();
    return (
      <FeaturedProjectForm
        mode="edit"
        initial={project}
        existingCategories={categories}
      />
    );
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
