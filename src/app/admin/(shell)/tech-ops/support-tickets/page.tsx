import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTickets } from "@/lib/api/tickets";
import { TicketsTable } from "./tickets-table";

export const dynamic = "force-dynamic";

export default async function SupportTicketsPage() {
  const { data, meta } = await getAdminTickets({ limit: 50 });

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

      <Card className="overflow-hidden p-0">
        <TicketsTable items={data} />
      </Card>
    </div>
  );
}
