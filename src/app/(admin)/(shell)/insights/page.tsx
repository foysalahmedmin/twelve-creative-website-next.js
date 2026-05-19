import { Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminInsights } from "@/lib/api/insights";
import { InsightsTable } from "./insights-table";
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

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = isFilter(params.filter) ? params.filter : undefined;

  const { data, meta } = await getAdminInsights({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Insights"
        description={`${meta?.total ?? data.length} ${filter ?? "total"} · published articles appear at /blogs.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Insights" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/insights/new">
              <Plus className="size-4" />
              New article
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.value === filter || (!f.value && !filter);
          const href = f.value ? `/admin/insights?filter=${f.value}` : "/admin/insights";
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
      </div>

      <Card className="p-0 overflow-hidden">
        <InsightsTable items={data} />
      </Card>
    </div>
  );
}
