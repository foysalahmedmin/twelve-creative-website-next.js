"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteBookingAction,
  updateBookingAction,
} from "@/lib/api/bookings-actions";
import type { Booking, BookingStatus } from "@/lib/api/bookings";

interface Props {
  booking: Booking;
}

const STATUS_OPTIONS: { value: BookingStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function BookingDetailActions({ booking }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [note, setNote] = useState<string>(booking.internal_note ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const dirty =
    status !== booking.status || note !== (booking.internal_note ?? "");

  const handleSave = async () => {
    setSaving(true);
    const res = await updateBookingAction(booking._id, {
      status,
      internal_note: note,
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success("Booking updated");
    router.refresh();
  };

  const handleDelete = async () => {
    const res = await deleteBookingAction(booking._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Booking deleted");
    router.push("/admin/bookings");
    router.refresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admin actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as BookingStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="internal_note">Internal note</Label>
            <Textarea
              id="internal_note"
              rows={4}
              maxLength={2000}
              placeholder="Notes for the team — never shown publicly."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              {note.length} / 2000
            </p>
          </div>

          <div className="flex justify-between gap-2">
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
            <Button disabled={!dirty || saving} onClick={handleSave}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete this booking?"
        description={`Removes ${booking.name}'s booking request. The record can be restored later from soft-delete.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
