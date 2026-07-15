import { FeaturedProjectForm } from "../featured-project-form";
import { loadIndustryOptions } from "@/lib/admin/industry-options";

export const dynamic = "force-dynamic";

export default async function NewFeaturedProjectPage() {
  const industries = await loadIndustryOptions();
  return (
    <FeaturedProjectForm
      mode="create"
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}
