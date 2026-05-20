import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminShowcaseVideos } from "@/lib/api/showcase-videos";
import { ShowcaseVideosTable } from "./videos-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; filter?: string; page?: string }>;
}

export default async function ShowcaseVideosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminShowcaseVideos({
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
        title="Visual Library"
        description={`${meta?.total ?? data.length} total · only active items appear in the public marquee.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Visual Library" },
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

      <Card className="p-0 overflow-hidden">
        <ShowcaseVideosTable items={data} />
      </Card>
    </div>
  );
}
