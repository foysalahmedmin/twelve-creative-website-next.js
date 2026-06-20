import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminBrands } from "@/lib/api/brands";
import { BrandsTable } from "./brands-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

export default async function BrandsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminBrands({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter:
      params.filter === "active" || params.filter === "inactive"
        ? params.filter
        : undefined,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Brands"
        description={`${meta?.total ?? data.length} total · only active items render in the public Brands strip.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Brands" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/brands/new">
              <Plus className="size-4" />
              New brand
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search brands…" />
      </Suspense>

      <Card className="p-0 overflow-hidden">
        <BrandsTable items={data} />
      </Card>
    </div>
  );
}
