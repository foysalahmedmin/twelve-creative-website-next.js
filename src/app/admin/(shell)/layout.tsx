import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { requireAdminSession } from "@/lib/admin/session";
import { getPendingBookingCount } from "@/lib/api/bookings";
import { getUnreadMessageCount } from "@/lib/api/contact-messages";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, pendingBookings, unreadMessages] = await Promise.all([
    requireAdminSession(),
    getPendingBookingCount(),
    getUnreadMessageCount(),
  ]);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <AdminSidebar user={user} className="hidden md:flex" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          user={user}
          pendingBookings={pendingBookings}
          unreadMessages={unreadMessages}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
