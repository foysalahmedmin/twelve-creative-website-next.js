"use client";

import { format } from "date-fns";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ContactMessage } from "@/lib/api/contact-messages";
import { cn } from "@/lib/utils";

interface Props {
  items: ContactMessage[];
}

export function MessagesTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No messages yet</p>
        <p className="text-muted-foreground text-sm">
          Inbound messages from the public contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[110px]">Received</TableHead>
          <TableHead>From</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead className="w-[100px]">State</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item._id}
            className={cn(!item.is_read && !item.is_archived && "bg-primary/[0.02]")}
          >
            <TableCell className="text-muted-foreground whitespace-nowrap text-xs">
              {format(new Date(item.created_at), "d MMM yy")}
            </TableCell>
            <TableCell>
              <Link
                href={`/admin/messages/${item._id}`}
                className="hover:text-primary block transition-colors"
              >
                <p
                  className={cn(
                    "text-foreground text-sm",
                    !item.is_read && !item.is_archived
                      ? "font-semibold"
                      : "font-medium",
                  )}
                >
                  {item.name}
                </p>
                <p className="text-muted-foreground text-xs">{item.email}</p>
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground line-clamp-1 max-w-md text-sm">
              {item.subject || item.message}
            </TableCell>
            <TableCell>
              {item.is_archived ? (
                <StatusBadge label="Archived" tone="neutral" />
              ) : item.is_read ? (
                <StatusBadge label="Read" tone="positive" />
              ) : (
                <StatusBadge label="New" tone="warning" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
