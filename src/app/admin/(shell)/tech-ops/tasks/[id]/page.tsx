import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/admin/types";
import { getTaskById } from "@/lib/api/tasks";
import { TaskForm } from "../task-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;

  let task;
  try {
    task = await getTaskById(id);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={task.title}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Tasks", href: "/admin/tech-ops/tasks" },
          { label: task.title },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TaskForm task={task} />
        </CardContent>
      </Card>
    </div>
  );
}
