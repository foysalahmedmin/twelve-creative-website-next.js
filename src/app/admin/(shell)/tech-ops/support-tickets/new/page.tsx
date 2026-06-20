import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TicketForm } from "../ticket-form";

export default function NewTicketPage() {
  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title="New Ticket"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Support Tickets", href: "/admin/tech-ops/support-tickets" },
          { label: "New" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TicketForm />
        </CardContent>
      </Card>
    </div>
  );
}
