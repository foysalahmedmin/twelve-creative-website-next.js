import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getServiceById } from "@/lib/api/services";
import { ServiceForm } from "../../service-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  try {
    const service = await getServiceById(id);
    return <ServiceForm mode="edit" initial={service} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
