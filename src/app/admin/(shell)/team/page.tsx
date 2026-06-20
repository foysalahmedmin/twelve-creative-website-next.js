import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTeamMembers } from "@/lib/api/team-members";
import { TeamTable } from "./team-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

export default async function TeamPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminTeamMembers({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 100,
    filter:
      params.filter === "active" || params.filter === "inactive"
        ? params.filter
        : undefined,
  });

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="Team Members"
        description={`${meta?.total ?? data.length} total · only active members appear on the About page.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Team" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/team/new">
              <Plus className="size-4" />
              New member
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search team members…" />
      </Suspense>

      <Card className="p-0 overflow-hidden">
        <TeamTable items={data} />
      </Card>
    </div>
  );
}
