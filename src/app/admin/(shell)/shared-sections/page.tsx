import { Pencil } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAdminSharedSections,
  SHARED_SECTION_KEYS,
  SHARED_SECTION_LABELS,
} from "@/lib/api/shared-sections";

export const dynamic = "force-dynamic";

export default async function SharedSectionsAdminPage() {
  const sections = await getAdminSharedSections();
  const sectionMap = new Map(sections.map((section) => [section.key, section]));

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="Shared Sections"
        description="Manage reusable strategic sections and collection headings without changing the approved layout, animation, or theme behavior."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Shared Sections" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHARED_SECTION_KEYS.map((key) => {
          const section = sectionMap.get(key);
          return (
            <Card key={key} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground text-sm font-semibold">
                    {SHARED_SECTION_LABELS[key]}
                  </p>
                  <Badge
                    variant={
                      !section || section.is_active === false
                        ? "secondary"
                        : "default"
                    }
                  >
                    {section
                      ? section.is_active === false
                        ? "Inactive"
                        : "Active"
                      : "Not configured"}
                  </Badge>
                </div>
                <p className="text-muted-foreground line-clamp-2 min-h-8 text-xs">
                  {section?.title ?? "No managed section saved"}
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="mt-auto w-fit"
                >
                  <Link href={`/admin/shared-sections/${key}`}>
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
