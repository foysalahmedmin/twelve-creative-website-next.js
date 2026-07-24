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

  let brand: Awaited<ReturnType<typeof getBrandById>>;
  try {
    brand = await getBrandById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return <BrandForm mode="edit" initial={brand} />;
}
