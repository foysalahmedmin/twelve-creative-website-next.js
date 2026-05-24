import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminServices } from "@/lib/api/services";
import { ServicesTable } from "./services-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; filter?: string; page?: string }>;
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminServices({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 100,
    filter:
      params.filter === "active" || params.filter === "inactive"
        ? params.filter
        : undefined,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Services"
        description={`${meta?.total ?? data.length} total · drives home page cards and /what-we-build rows.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Services" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="size-4" />
              New service
            </Link>
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <ServicesTable items={data} />
      </Card>
    </div>
  );
}
