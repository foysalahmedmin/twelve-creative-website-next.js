import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminFeaturedProjects } from "@/lib/api/featured-projects";
import { FeaturedProjectsTable } from "./featured-projects-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; filter?: string; page?: string }>;
}

export default async function FeaturedProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminFeaturedProjects({
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
        title="Featured Projects"
        description={`${meta?.total ?? data.length} total · grouped by category as tabs on the public home page.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Featured Projects" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/featured-projects/new">
              <Plus className="size-4" />
              New project
            </Link>
          </Button>
        }
      />

      <Card className="p-0 overflow-hidden">
        <FeaturedProjectsTable items={data} />
      </Card>
    </div>
  );
}
