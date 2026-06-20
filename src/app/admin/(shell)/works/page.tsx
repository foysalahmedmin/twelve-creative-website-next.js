import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminWorks } from "@/lib/api/works";
import { WorksTable } from "./works-table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

const FILTERS: { label: string; value?: "published" | "draft" }[] = [
  { label: "All" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];

const isFilter = (v?: string): v is "published" | "draft" =>
  v === "published" || v === "draft";

export default async function WorksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = isFilter(params.filter) ? params.filter : undefined;

  const { data, meta } = await getAdminWorks({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Works"
        description={`${meta?.total ?? data.length} ${filter ?? "total"} · published items appear on the public Works page.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Works" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/works/new">
              <Plus className="size-4" />
              New work
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const active = f.value === filter || (!f.value && !filter);
          const href = f.value ? `/admin/works?filter=${f.value}` : "/admin/works";
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </Link>
          );
        })}
        <div className="ml-auto">
          <Suspense fallback={null}>
            <AdminSearch placeholder="Search works…" />
          </Suspense>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <WorksTable items={data} />
      </Card>
    </div>
  );
}
