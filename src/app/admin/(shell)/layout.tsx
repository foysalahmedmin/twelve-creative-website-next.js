import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { requireAdminSession } from "@/lib/admin/session";
import { getAdminNotifications } from "@/lib/api/notifications";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, { data: notifications, meta }] = await Promise.all([
    requireAdminSession(),
    getAdminNotifications(20),
  ]);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <AdminSidebar user={user} className="hidden md:flex" />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          user={user}
          notifications={notifications}
          unreadCount={meta.unread ?? 0}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
