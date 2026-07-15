import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IndustryMediaFilters } from "@/components/admin/industry-media-filters";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getAdminShowcaseVideos,
  type ShowcaseAspect,
} from "@/lib/api/showcase-videos";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { ShowcaseVideosTable } from "./videos-table";

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

export default async function ShowcaseVideosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const aspect = parseAspect(params.aspect);
  const industry = parseObjectId(params.industry);
  const [{ data, meta }, industryOptions] = await Promise.all([
    getAdminShowcaseVideos({
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
  const selectedIndustryIsValid = industryOptions.data.some(
    (option) => option._id === industry,
  );
  const hasAdditionalFilters = Boolean(
    params.search?.trim() ||
    params.filter ||
    (params.page && Number(params.page) > 1),
  );
  const completeGroupLoaded = (meta?.total ?? data.length) <= data.length;
  const reorderScope =
    industry &&
    selectedIndustryIsValid &&
    aspect &&
    !hasAdditionalFilters &&
    completeGroupLoaded
      ? { industry, aspect }
      : undefined;
  const reorderDisabledReason = industryOptions.error
    ? "Industry options are unavailable, so reordering is disabled."
    : !industry || !selectedIndustryIsValid || !aspect
      ? "Select one Industry and one aspect to reorder videos within that group."
      : hasAdditionalFilters
        ? "Clear search and status filters before reordering the complete group."
        : !completeGroupLoaded
          ? "The complete group must be loaded before it can be reordered."
          : undefined;

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Showcase Videos"
        description={`${meta?.total ?? data.length} total · Industry-owned videos for public showcase surfaces.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Showcase Videos" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/videos/new">
              <Plus className="size-4" />
              New video
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearch placeholder="Search showcase videos…" />
          <IndustryMediaFilters industries={industryOptions.data} />
        </div>
      </Suspense>

      {industryOptions.error ? (
        <p className="text-destructive text-sm" role="alert">
          {industryOptions.error} Industry filtering and reordering are
          temporarily unavailable.
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <ShowcaseVideosTable
          key={`${params.industry ?? "all"}:${aspect ?? "all"}:${data
            .map((item) => `${item._id}:${item.order}:${item.is_active}`)
            .join(",")}`}
          items={data}
          reorderScope={reorderScope}
          reorderDisabledReason={reorderDisabledReason}
        />
      </Card>
    </div>
  );
}

function parseAspect(value?: string): ShowcaseAspect | undefined {
  return value === "reel" || value === "landscape" ? value : undefined;
}

function parseObjectId(value?: string): string | undefined {
  return value && /^[0-9a-f]{24}$/i.test(value) ? value : undefined;
}
