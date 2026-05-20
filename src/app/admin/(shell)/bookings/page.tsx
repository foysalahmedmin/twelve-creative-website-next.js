import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { getAdminBookings, type BookingStatus } from "@/lib/api/bookings";
import { BookingsTable } from "./bookings-table";
import { BookingsFilter } from "./bookings-filter";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

const isStatus = (v?: string): v is BookingStatus =>
  v === "pending" ||
  v === "in_progress" ||
  v === "completed" ||
  v === "cancelled";

export default async function BookingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = isStatus(params.filter) ? params.filter : undefined;

  const { data, meta } = await getAdminBookings({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Bookings"
        description={`${meta?.total ?? data.length} ${filter ? `with status ${filter.replace("_", " ")}` : "total"}.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Bookings" },
        ]}
      />

      <BookingsFilter current={filter} />

      <Card className="p-0 overflow-hidden">
        <BookingsTable items={data} />
      </Card>
    </div>
  );
}
