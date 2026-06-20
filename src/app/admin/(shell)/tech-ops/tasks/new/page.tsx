import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";
import { TaskForm } from "../task-form";

export default function NewTaskPage() {
  return (
    <div className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title="New Task"
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Tasks", href: "/admin/tech-ops/tasks" },
          { label: "New" },
        ]}
      />
      <Card>
        <CardContent className="pt-6">
          <TaskForm />
        </CardContent>
      </Card>
    </div>
  );
}
