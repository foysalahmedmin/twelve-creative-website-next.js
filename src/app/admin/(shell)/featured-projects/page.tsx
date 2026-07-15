import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IndustryMediaFilters } from "@/components/admin/industry-media-filters";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAdminFeaturedProjects,
  type FeaturedProjectAspect,
} from "@/lib/api/featured-projects";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { FeaturedProjectsTable } from "./featured-projects-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
    industry?: string;
    aspect?: string;
  }>;
}

export default async function FeaturedProjectsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const aspect = parseAspect(params.aspect);
  const industry = parseObjectId(params.industry);
  const [{ data, meta }, industryOptions] = await Promise.all([
    getAdminFeaturedProjects({
      search: params.search,
      page: params.page ? Number(params.page) : 1,
      limit: 100,
      filter:
        params.filter === "active" || params.filter === "inactive"
          ? params.filter
          : undefined,
      industry,
      aspect,
    }),
    loadIndustryOptions(),
  ]);

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Featured Projects"
        description={`${meta?.total ?? data.length} total · grouped by Industry as tabs on the public home page.`}
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

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearch placeholder="Search featured projects…" />
          <IndustryMediaFilters industries={industryOptions.data} />
        </div>
      </Suspense>

      {industryOptions.error ? (
        <p className="text-destructive text-sm" role="alert">
          {industryOptions.error} Industry filtering is temporarily unavailable.
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <FeaturedProjectsTable items={data} />
      </Card>
    </div>
  );
}

function parseAspect(value?: string): FeaturedProjectAspect | undefined {
  return value === "reel" || value === "landscape" ? value : undefined;
}

function parseObjectId(value?: string): string | undefined {
  return value && /^[0-9a-f]{24}$/i.test(value) ? value : undefined;
}
