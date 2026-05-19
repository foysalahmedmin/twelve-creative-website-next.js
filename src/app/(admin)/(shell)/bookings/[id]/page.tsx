import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/admin/types";
import { getBookingById } from "@/lib/api/bookings";
import { BookingDetailActions } from "./booking-detail-actions";
import { BookingStatusBadge } from "../status-pill";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const fieldRow = (label: string, value?: string) => (
  <div className="grid grid-cols-3 gap-3 border-b border-border/40 py-2.5 last:border-b-0">
    <dt className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
      {label}
    </dt>
    <dd className="text-foreground col-span-2 text-sm">{value || "—"}</dd>
  </div>
);

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;

  let booking;
  try {
    booking = await getBookingById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const preferredDate = booking.preferred_date
    ? new Date(booking.preferred_date).toDateString()
    : undefined;

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <AdminPageHeader
        title={booking.name}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Bookings", href: "/admin/bookings" },
          { label: booking.name },
        ]}
        action={<BookingStatusBadge status={booking.status} />}
      />

      <Card>
        <CardContent className="pt-6">
          <dl>
            {fieldRow("Email", booking.email)}
            {fieldRow("Phone", booking.phone)}
            {fieldRow("Company", booking.company)}
            {fieldRow("Industry", booking.industry)}
            {fieldRow("Timeline", booking.timeline)}
            {fieldRow("Preferred date", preferredDate)}
            {fieldRow("Preferred time", booking.preferred_time)}
            {fieldRow("Message", booking.message)}
          </dl>
        </CardContent>
      </Card>

      <BookingDetailActions booking={booking} />
    </div>
  );
}
