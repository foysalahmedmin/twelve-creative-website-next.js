import { FeaturedProjectForm } from "../featured-project-form";

export const dynamic = "force-dynamic";

export default async function NewFeaturedProjectPage() {
  return <FeaturedProjectForm mode="create" />;
}
