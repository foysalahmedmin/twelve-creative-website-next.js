import { getAdminFeaturedProjects } from "@/lib/api/featured-projects";
import { FeaturedProjectForm } from "../featured-project-form";

export const dynamic = "force-dynamic";

export default async function NewFeaturedProjectPage() {
  // Pre-fetch existing categories so the admin can autocomplete.
  const { data } = await getAdminFeaturedProjects({ limit: 200 }).catch(() => ({
    data: [],
  }));
  const categories = Array.from(new Set(data.map((p) => p.category))).sort();
  return <FeaturedProjectForm mode="create" existingCategories={categories} />;
}
