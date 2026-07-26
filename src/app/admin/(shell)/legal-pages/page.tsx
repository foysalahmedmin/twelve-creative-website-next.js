import { CalendarDays, ExternalLink, FileText, Pencil } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAdminLegalPages,
  LEGAL_PAGE_LABELS,
  LEGAL_PAGE_SLUGS,
} from "@/lib/api/legal-pages";

export const dynamic = "force-dynamic";

function formatDate(value: string | null): string {
  if (!value) return "No effective date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default async function LegalPagesAdminPage() {
  const savedPages = await getAdminLegalPages();

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="Legal Pages"
        description="Manage counsel-approved Markdown, effective dates, publishing status, and search metadata for the two supported legal pages."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Legal Pages" },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {LEGAL_PAGE_SLUGS.map((slug) => {
          const page = savedPages.find((item) => item.slug === slug);
          return (
            <Card key={slug}>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                      <FileText className="size-5" />
                    </div>
                    <CardTitle>
                      {page?.title || LEGAL_PAGE_LABELS[slug]}
                    </CardTitle>
                    <CardDescription>/{slug}</CardDescription>
                  </div>
                  <Badge variant={page?.is_published ? "default" : "outline"}>
                    {page?.is_published
                      ? "Published"
                      : page
                        ? "Draft"
                        : "Not created"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDays className="size-4" />
                  {formatDate(page?.effective_date ?? null)}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/admin/legal-pages/${slug}`}>
                      <Pencil className="size-4" />
                      Edit page
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/${slug}`} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
