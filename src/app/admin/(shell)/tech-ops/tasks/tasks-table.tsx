"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/status-badge";
import type { Task, TaskPriority, TaskStatus } from "@/lib/api/tasks";

const STATUS_TONE: Record<TaskStatus, "warning" | "info" | "positive"> = {
  todo: "warning",
  in_progress: "info",
  done: "positive",
};
const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_TONE: Record<TaskPriority, "danger" | "warning" | "neutral"> = {
  high: "danger",
  medium: "warning",
  low: "neutral",
};

export function TasksTable({ items }: { items: Task[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No tasks yet</p>
        <p className="text-muted-foreground text-sm">Create a task to start tracking work.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              <Link
                href={`/admin/tech-ops/tasks/${item._id}`}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {item.title}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge label={item.priority} tone={PRIORITY_TONE[item.priority]} />
            </TableCell>
            <TableCell>
              <StatusBadge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              {item.due_date ? format(new Date(item.due_date), "d MMM yy") : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
