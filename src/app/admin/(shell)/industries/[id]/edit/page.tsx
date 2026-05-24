import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getIndustryById } from "@/lib/api/industries";
import { IndustryForm } from "../../industry-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIndustryPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const industry = await getIndustryById(id);
    return <IndustryForm mode="edit" initial={industry} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
