"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTicketAction, updateTicketAction } from "@/lib/api/tickets-actions";
import type { Ticket, TicketPriority, TicketStatus } from "@/lib/api/tickets";

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

interface Props {
  ticket?: Ticket;
}

export function TicketForm({ ticket }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(ticket?.title ?? "");
  const [description, setDescription] = useState(ticket?.description ?? "");
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority ?? "medium");
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? "open");
  const [saving, setSaving] = useState(false);

  const isEdit = !!ticket;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const res = isEdit
      ? await updateTicketAction(ticket._id, { title, description: description || null, priority, status })
      : await createTicketAction({ title, description: description || undefined, priority });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(isEdit ? "Ticket updated" : "Ticket created");
    router.push("/admin/tech-ops/support-tickets");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe the issue…"
          maxLength={200}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide additional context…"
          rows={4}
          maxLength={2000}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isEdit && (
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !title.trim()}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create ticket"}
        </Button>
      </div>
    </form>
  );
}
