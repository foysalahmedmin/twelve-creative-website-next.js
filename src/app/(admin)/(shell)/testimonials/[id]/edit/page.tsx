import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getTestimonialById } from "@/lib/api/testimonials";
import { TestimonialForm } from "../../testimonial-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const testimonial = await getTestimonialById(id);
    return <TestimonialForm mode="edit" initial={testimonial} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
