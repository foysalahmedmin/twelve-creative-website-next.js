import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getFaqById } from "@/lib/api/faqs";
import { FaqForm } from "../../faq-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const faq = await getFaqById(id);
    return <FaqForm mode="edit" initial={faq} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
