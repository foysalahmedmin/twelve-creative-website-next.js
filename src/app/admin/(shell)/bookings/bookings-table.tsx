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
import type { Booking } from "@/lib/api/bookings";
import { BookingStatusBadge } from "./status-pill";
import { LeadSourceBadge } from "./lead-source-badge";

interface Props {
  items: Booking[];
}

export function BookingsTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No bookings yet</p>
        <p className="text-muted-foreground text-sm">
          New requests from the public booking form will show up here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Received</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Lead Source</TableHead>
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
                href={`/admin/bookings/${item._id}`}
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                {item.name}
                <span className="text-muted-foreground block text-xs">
                  {item.email}
                </span>
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              {item.industry ?? "—"}
            </TableCell>
            <TableCell className="text-muted-foreground text-xs">
              {item.timeline ?? "—"}
            </TableCell>
            <TableCell>
              <LeadSourceBadge source={item.lead_source} />
            </TableCell>
            <TableCell>
              <BookingStatusBadge status={item.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
