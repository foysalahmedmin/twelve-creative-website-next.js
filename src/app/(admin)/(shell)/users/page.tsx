import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/admin/session";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { getAdminAccounts } from "@/lib/api/admin-users";
import { UsersTable } from "./users-table";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const session = await requireAdminSession();
  if (session.role !== "admin") redirect(ADMIN_CONFIG.dashboardPath);

  const params = await searchParams;
  const { data, meta } = await getAdminAccounts({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
  });

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="Admin Users"
        description={`${meta?.total ?? data.length} accounts with admin panel access.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Users" },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-sm">
            To invite a new teammate: have them sign up at
            <code className="bg-muted mx-1 rounded px-1 py-0.5 text-xs">
              /signup
            </code>
            (creates an `editor` account by default). You can then promote them
            to `admin` from the row below.
          </p>
        </CardContent>
      </Card>

      <Card className="p-0 overflow-hidden">
        <UsersTable items={data} currentUserId={session._id} />
      </Card>
    </div>
  );
}
