import { VideoForm } from "../video-form";
import { loadIndustryOptions } from "@/lib/admin/industry-options";

export const dynamic = "force-dynamic";

export default async function NewShowcaseVideoPage() {
  const industries = await loadIndustryOptions();
  return (
    <VideoForm
      mode="create"
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}
