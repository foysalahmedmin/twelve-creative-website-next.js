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
import type { Ticket, TicketPriority, TicketStatus } from "@/lib/api/tickets";

const STATUS_TONE: Record<TicketStatus, "warning" | "info" | "positive" | "danger" | "neutral"> = {
  open: "warning",
  in_progress: "info",
  resolved: "positive",
  closed: "neutral",
};
const STATUS_LABEL: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const PRIORITY_TONE: Record<TicketPriority, "danger" | "warning" | "info" | "neutral"> = {
  urgent: "danger",
  high: "warning",
  medium: "info",
  low: "neutral",
};

export function TicketsTable({ items }: { items: Ticket[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No tickets yet</p>
        <p className="text-muted-foreground text-sm">Create a ticket to start tracking support issues.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Created</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item._id}>
            <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
              {format(new Date(item.created_at), "d MMM yy")}
            </TableCell>
            <TableCell>
              <Link
                href={`/admin/tech-ops/support-tickets/${item._id}`}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {item.title}
                {item.created_by && (
                  <span className="text-muted-foreground block text-xs">{item.created_by}</span>
                )}
              </Link>
            </TableCell>
            <TableCell>
              <StatusBadge label={item.priority} tone={PRIORITY_TONE[item.priority]} />
            </TableCell>
            <TableCell>
              <StatusBadge label={STATUS_LABEL[item.status]} tone={STATUS_TONE[item.status]} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
