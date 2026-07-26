import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getTestimonialById } from "@/lib/api/testimonials";
import { TestimonialForm } from "../../testimonial-form";
import { loadIndustryOptions } from "@/lib/admin/industry-options";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: PageProps) {
  const { id } = await params;

  const [testimonialResult, industries] = await Promise.all([
    getTestimonialById(id).then(
      (data) => ({ data, error: undefined }),
      (error: unknown) => ({ data: undefined, error }),
    ),
    loadIndustryOptions(),
  ]);
  if (testimonialResult.error) {
    const e = testimonialResult.error;
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <TestimonialForm
      mode="edit"
      initial={testimonialResult.data}
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}
