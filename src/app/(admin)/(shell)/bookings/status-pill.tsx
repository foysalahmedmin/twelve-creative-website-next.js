import { StatusBadge } from "@/components/admin/status-badge";
import type { BookingStatus } from "@/lib/api/bookings";

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_TONE: Record<
  BookingStatus,
  "warning" | "info" | "positive" | "danger"
> = {
  pending: "warning",
  in_progress: "info",
  completed: "positive",
  cancelled: "danger",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <StatusBadge label={STATUS_LABEL[status]} tone={STATUS_TONE[status]} />;
}
