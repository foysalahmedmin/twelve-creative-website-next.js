import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdminSession } from "@/lib/admin/session";
import { ADMIN_CONFIG } from "@/lib/admin/config";
import { getAdminAccounts } from "@/lib/api/admin-users";
import { UsersTable } from "./users-table";

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
        action={
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus className="size-4" />
              New user
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search users…" />
      </Suspense>

      <Card className="p-0 overflow-hidden">
        <UsersTable items={data} currentUserId={session._id} />
      </Card>
    </div>
  );
}
