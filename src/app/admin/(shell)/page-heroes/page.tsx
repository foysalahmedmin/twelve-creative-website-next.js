import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAdminPageHeroes,
  PAGE_KEYS,
  PAGE_LABELS,
  type ApiPageHero,
  type PageKey,
} from "@/lib/api/page-heroes";

export const dynamic = "force-dynamic";

const PUBLIC_PATH: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  works: "/works",
  industries: "/industries",
  "what-we-build": "/what-we-build",
  contact: "/contact",
  blogs: "/blogs",
  process: "/process",
};

export default async function PageHeroesPage() {
  const heroes = await getAdminPageHeroes();
  const heroMap = Object.fromEntries(heroes.map((h) => [h.page, h])) as Record<
    PageKey,
    ApiPageHero | undefined
  >;

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <AdminPageHeader
        title="Page Heroes"
        description="Control the hero section copy and optional video for each public page. Changes take effect immediately."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Page Heroes" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {PAGE_KEYS.map((page) => {
          const hero = heroMap[page];
          const isActive = hero?.is_active !== false;

          return (
            <Card key={page} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-3 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-foreground text-sm font-semibold">
                      {PAGE_LABELS[page]}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {PUBLIC_PATH[page]}
                    </p>
                  </div>
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Live" : "Static"}
                  </Badge>
                </div>

                {hero?.title && (
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {hero.title}
                  </p>
                )}

                <div className="mt-auto flex items-center gap-2 pt-1">
                  <Button asChild size="sm" variant="outline" className="gap-1.5">
                    <Link href={`/admin/page-heroes/${page}/edit`}>
                      <Pencil className="size-3.5" />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="gap-1.5">
                    <Link href={PUBLIC_PATH[page]} target="_blank">
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
    </div>
  );
}
