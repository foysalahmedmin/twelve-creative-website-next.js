import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/admin/types";
import { getTicketById } from "@/lib/api/tickets";
import { TicketForm } from "../ticket-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params;

  let ticket;
  try {
    ticket = await getTicketById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={ticket.title}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Support Tickets", href: "/admin/tech-ops/support-tickets" },
          { label: ticket.title },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TicketForm ticket={ticket} />
        </CardContent>
      </Card>
    </div>
  );
}
