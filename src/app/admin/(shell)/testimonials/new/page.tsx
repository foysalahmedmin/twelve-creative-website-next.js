import { TestimonialForm } from "../testimonial-form";
import { loadIndustryOptions } from "@/lib/admin/industry-options";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  const industries = await loadIndustryOptions();
  return (
    <TestimonialForm
      mode="create"
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}
