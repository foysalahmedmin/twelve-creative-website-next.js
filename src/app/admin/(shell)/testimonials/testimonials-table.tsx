"use client";

import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
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
  reorderTestimonialsAction,
  toggleTestimonialActiveAction,
} from "@/lib/api/testimonials-actions";
import type { Testimonial } from "@/lib/api/testimonials";
import { cn } from "@/lib/utils";

interface Props {
  items: Testimonial[];
}

export function TestimonialsTable({ items: propItems }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [items, setItems] = useState(propItems);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setItems(propItems);
    setDirty(false);
  }, [propItems]);

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

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const from = items.findIndex((i) => i._id === dragId);
    const to = items.findIndex((i) => i._id === targetId);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDirty(true);
    setDragId(null);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    const res = await reorderTestimonialsAction(
      items.map((item, i) => ({ _id: item._id, order: i + 1 })),
    );
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to save order");
      return;
    }
    toast.success("Order saved");
    setDirty(false);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="No testimonials yet"
        description="Create your first one to populate the public Testimonial section."
        action={{ label: "Add testimonial", href: "/admin/testimonials/new" }}
      />
    );
  }

  return (
    <>
      {dirty && (
        <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/40">
          <p className="text-xs text-muted-foreground">Unsaved order changes</p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setItems(propItems); setDirty(false); }}
            >
              Discard
            </Button>
            <Button size="sm" disabled={saving} onClick={handleSaveOrder}>
              {saving && <Loader2 className="mr-1 size-3 animate-spin" />}
              Save order
            </Button>
          </div>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>Person</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Preview</TableHead>
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item._id}
              draggable
              onDragStart={() => setDragId(item._id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item._id)}
              onDragEnd={() => setDragId(null)}
              className={cn(dragId === item._id && "opacity-40")}
            >
              <TableCell>
                <GripVertical className="text-muted-foreground size-4 cursor-grab active:cursor-grabbing" />
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
