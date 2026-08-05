import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminBookingSetting } from "@/lib/api/booking-settings";
import { BookingSettingForm } from "./booking-setting-form";

export const dynamic = "force-dynamic";

export default async function AdminBookingPage() {
  const setting = await getAdminBookingSetting();

  return (
    <div className="container max-w-3xl space-y-6 py-8">
      <AdminPageHeader
        title="Booking"
        description="Copy for the booking section, the questions asked in the booking modal, and when calls can be booked."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Booking" },
        ]}
      />
      <BookingSettingForm initial={setting} />
    </div>
  );
}
