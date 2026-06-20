import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTickets } from "@/lib/api/tickets";
import { TicketsTable } from "./tickets-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function SupportTicketsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminTickets({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Support Tickets"
        description={`${meta?.total ?? data.length} total tickets`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Tech Ops" },
          { label: "Support Tickets" },
        ]}
        action={
          <Button asChild size="sm">
            <Link href="/admin/tech-ops/support-tickets/new">
              <Plus className="size-4" />
              New Ticket
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search tickets…" />
      </Suspense>

      <Card className="overflow-hidden p-0">
        <TicketsTable items={data} />
      </Card>
    </div>
  );
}
