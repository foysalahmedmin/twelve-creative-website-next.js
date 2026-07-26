import { ExternalLink, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAdminIndustryOptions } from "@/lib/api/industries";
import {
  getAdminPageCtas,
  PAGE_CTA_LABELS,
  PAGE_CTA_PLACEMENTS,
  type ApiPageCta,
  type PageCtaPlacement,
} from "@/lib/api/page-ctas";

export const dynamic = "force-dynamic";

const PUBLIC_PATH: Record<PageCtaPlacement, string> = {
  home: "/",
  about: "/about",
  works: "/works",
  industries: "/industries",
  process: "/process",
  "what-we-build": "/what-we-build",
  "industry-detail": "/industries",
};

function industryId(record: ApiPageCta): string | undefined {
  return typeof record.industry === "string"
    ? record.industry
    : record.industry?._id;
}

export default async function PageCtasAdminPage() {
  const [records, industries] = await Promise.all([
    getAdminPageCtas(),
    getAdminIndustryOptions(),
  ]);
  const globals = new Map(
    records
      .filter((record) => !industryId(record))
      .map((record) => [record.placement, record]),
  );
  const overrides = records.filter(
    (record) =>
      record.placement === "industry-detail" && Boolean(industryId(record)),
  );

  return (
    <div className="container max-w-5xl space-y-8 py-8">
      <AdminPageHeader
        title="Page CTAs"
        description="Manage conversion calls-to-action for every page. Industry pages use the global Industry Detail CTA unless an active Industry override exists."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Page CTAs" },
        ]}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-foreground text-base font-semibold">
            Global page CTAs
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure one global record for each supported placement. A missing
            or inactive record is hidden publicly.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAGE_CTA_PLACEMENTS.map((placement) => {
            const record = globals.get(placement);
            return (
              <Card key={placement} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-foreground text-sm font-semibold">
                        {PAGE_CTA_LABELS[placement]}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Global default
                      </p>
                    </div>
                    <Badge
                      variant={
                        !record || record.is_active === false
                          ? "secondary"
                          : "default"
                      }
                    >
                      {record
                        ? record.is_active === false
                          ? "Inactive"
                          : "Active"
                        : "Not configured"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 min-h-8 text-xs">
                    {record?.title ?? "No managed CTA saved"}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/page-ctas/${placement}`}>
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={PUBLIC_PATH[placement]} target="_blank">
                        <ExternalLink className="size-3.5" />
                        View
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-foreground text-base font-semibold">
              Industry overrides
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Optional CTA content for a specific active Industry.
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/page-ctas/industry-detail?scope=industry">
              <Plus className="size-4" />
              Add override
            </Link>
          </Button>
        </div>

        {overrides.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {overrides.map((record) => {
              const id = industryId(record)!;
              const populated =
                typeof record.industry === "object" ? record.industry : null;
              const industry =
                populated ?? industries.find((item) => item._id === id);
              return (
                <Card key={record._id ?? id}>
                  <CardContent className="flex items-center justify-between gap-4 pt-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground truncate text-sm font-semibold">
                          {industry?.name ?? "Unknown Industry"}
                        </p>
                        <Badge
                          variant={
                            record.is_active === false ? "secondary" : "default"
                          }
                        >
                          {record.is_active === false ? "Inactive" : "Active"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
                        {record.title}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/admin/page-ctas/industry-detail?scope=industry&industry=${id}`}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-center text-sm">
              No Industry overrides configured. Industry pages use the active
              global Industry Detail CTA when available.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
