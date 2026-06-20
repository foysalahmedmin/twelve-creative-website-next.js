import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTasks } from "@/lib/api/tasks";
import { TasksTable } from "./tasks-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function TasksPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminTasks({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Tasks"
        description={`${meta?.total ?? data.length} total tasks`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Tech Ops" },
          { label: "Tasks" },
        ]}
        action={
          <Button asChild size="sm">
            <Link href="/admin/tech-ops/tasks/new">
              <Plus className="size-4" />
              New Task
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search tasks…" />
      </Suspense>

      <Card className="overflow-hidden p-0">
        <TasksTable items={data} />
      </Card>
    </div>
  );
}
