import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getInsightById } from "@/lib/api/insights";
import { InsightForm } from "../../insight-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInsightPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const article = await getInsightById(id);
    return <InsightForm mode="edit" initial={article} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
