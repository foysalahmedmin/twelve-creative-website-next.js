import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getBrandById } from "@/lib/api/brands";
import { BrandForm } from "../../brand-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const brand = await getBrandById(id);
    return <BrandForm mode="edit" initial={brand} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
