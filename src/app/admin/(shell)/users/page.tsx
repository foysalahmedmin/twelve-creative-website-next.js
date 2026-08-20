import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdminRole } from "@/lib/admin/session";
import { getAdminAccounts } from "@/lib/api/admin-users";
import { positivePage } from "@/lib/admin/pagination";
import { UsersTable } from "./users-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Kept alongside the layout's guard, not replaced by it: this one runs in
  // the same component as the admin-only fetch below, so an editor is turned
  // away before that request is ever made.
  const session = await requireAdminRole("admin");

  const params = await searchParams;
  const page = positivePage(params.page);
  const { data, meta } = await getAdminAccounts({
    search: params.search,
    page,
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

      <AdminPagination
        path="/admin/users"
        page={page}
        totalPages={meta?.total_pages ?? 1}
        query={{
          search: params.search,
        }}
      />
    </div>
  );
}
