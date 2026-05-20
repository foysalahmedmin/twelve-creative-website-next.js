"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/lib/api/testimonials-actions";
import type { Testimonial } from "@/lib/api/testimonials";

interface Props {
  items: Testimonial[];
}

export function TestimonialsTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const handleToggle = (item: Testimonial, next: boolean) => {
    startTransition(async () => {
      const res = await toggleTestimonialActiveAction(item._id, next);
      if (!res.ok) {
        toast.error(res.error ?? "Failed to update");
        return;
      }
      toast.success(`Marked ${next ? "active" : "inactive"}`);
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteTestimonialAction(deleteTarget._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Testimonial deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No testimonials yet</p>
        <p className="text-muted-foreground text-sm">
          Create your first one to populate the public Testimonial section.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/testimonials/new">Add testimonial</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Order</TableHead>
            <TableHead>Person</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Preview</TableHead>
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="text-muted-foreground tabular-nums">
                {item.order}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-muted size-9 rounded-full" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-foreground text-sm font-medium leading-tight">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground text-xs leading-tight">
                      {item.designation}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={item.category === "video_message" ? "Video" : "Text"}
                  tone={item.category === "video_message" ? "info" : "neutral"}
                />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <p className="text-muted-foreground line-clamp-2 max-w-md text-xs">
                  {item.category === "message"
                    ? item.message
                    : item.video_message?.source === "youtube"
                      ? `YouTube · ${item.video_message.value}`
                      : item.video_message?.value}
                </p>
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.is_active}
                  disabled={pending}
                  onCheckedChange={(next) => handleToggle(item, next)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/testimonials/${item._id}/edit`}>
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(item)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "testimonial"}?`}
        description="This removes the testimonial from the public site. It can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
