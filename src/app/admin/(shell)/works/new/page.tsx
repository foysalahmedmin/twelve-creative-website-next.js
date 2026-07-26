import { WorkForm } from "../work-form";
import { loadIndustryOptions } from "@/lib/admin/industry-options";

export const dynamic = "force-dynamic";

export default async function NewWorkPage() {
  const industries = await loadIndustryOptions();

  return (
    <WorkForm
      mode="create"
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}
