import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTasks } from "@/lib/api/tasks";
import { TasksTable } from "./tasks-table";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const { data, meta } = await getAdminTasks({ limit: 50 });

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

      <Card className="overflow-hidden p-0">
        <TasksTable items={data} />
      </Card>
    </div>
  );
}
