"use client";

import Link from "next/link";
import type { BookingStatus } from "@/lib/api/bookings";
import { cn } from "@/lib/utils";

const FILTERS: { label: string; value?: BookingStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

interface Props {
  current?: BookingStatus;
}

export function BookingsFilter({ current }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const active = f.value === current || (!f.value && !current);
        const href = f.value ? `/admin/bookings?filter=${f.value}` : "/admin/bookings";
        return (
          <Link
            key={f.label}
            href={href}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </Link>
        );
      })}
    </div>
  );
}
