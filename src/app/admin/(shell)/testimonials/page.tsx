import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { IndustryMediaFilters } from "@/components/admin/industry-media-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTestimonials } from "@/lib/api/testimonials";
import { TestimonialsTable } from "./testimonials-table";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { positivePage } from "@/lib/admin/pagination";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    filter?: string;
    page?: string;
    industry?: string;
  }>;
}

export default async function TestimonialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = positivePage(params.page);
  const industry =
    params.industry && /^[0-9a-f]{24}$/i.test(params.industry)
      ? params.industry
      : undefined;
  const [{ data, meta }, industryOptions] = await Promise.all([
    getAdminTestimonials({
      search: params.search,
      page,
      limit: 50,
      filter:
        params.filter === "active" || params.filter === "inactive"
          ? params.filter
          : undefined,
      industry,
    }),
    loadIndustryOptions(),
  ]);
  const tableVersion = data
    .map(
      (item) =>
        `${item._id}:${item.order}:${item.is_active}:${item.updated_at ?? ""}`,
    )
    .join("|");
  const totalPages = Math.max(1, meta?.total_pages ?? 1);
  const canReorder =
    Boolean(meta) &&
    !params.search?.trim() &&
    !params.filter &&
    !industry &&
    page === 1 &&
    meta!.total_pages <= 1 &&
    meta!.total === data.length;

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Testimonials"
        description={`${meta?.total ?? data.length} total · public site only renders items toggled active.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Testimonials" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/testimonials/new">
              <Plus className="size-4" />
              New testimonial
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearch placeholder="Search testimonials…" />
          <IndustryMediaFilters
            industries={industryOptions.data}
            showAspect={false}
          />
        </div>
      </Suspense>

      {industryOptions.error ? (
        <p className="text-destructive text-sm" role="alert">
          {industryOptions.error} Industry filtering is temporarily unavailable.
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <TestimonialsTable
          key={tableVersion}
          items={data}
          canReorder={canReorder}
        />
      </Card>

      {!canReorder && data.length > 0 ? (
        <p className="text-muted-foreground text-xs">
          Drag ordering is available only when the complete, unfiltered list is
          visible on one page.
        </p>
      ) : null}

      <AdminPagination
        path="/admin/testimonials"
        page={page}
        totalPages={totalPages}
        query={{
          search: params.search,
          filter: params.filter,
          industry: params.industry,
        }}
      />
    </div>
  );
}
