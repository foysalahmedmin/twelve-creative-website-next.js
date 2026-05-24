import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAdminPageHero,
  PAGE_KEYS,
  PAGE_LABELS,
  type PageKey,
} from "@/lib/api/page-heroes";
import { PageHeroForm } from "../../page-hero-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ page: string }>;
}

export default async function EditPageHeroPage({ params }: Props) {
  const { page } = await params;

  if (!(PAGE_KEYS as readonly string[]).includes(page)) notFound();

  const pageKey = page as PageKey;
  const hero = await getAdminPageHero(pageKey);

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={`${PAGE_LABELS[pageKey]} — Hero`}
        description="Edit the hero section copy and optional video for this page."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Page Heroes", href: "/admin/page-heroes" },
          { label: PAGE_LABELS[pageKey] },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <PageHeroForm page={pageKey} initial={hero} />
        </CardContent>
      </Card>
    </div>
  );
}
