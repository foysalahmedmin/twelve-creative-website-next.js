"use client";

import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { EmptyState } from "@/components/admin/empty-state";
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
  deleteFaqAction,
  reorderFaqsAction,
  toggleFaqActiveAction,
} from "@/lib/api/faqs-actions";
import type { Faq } from "@/lib/api/faqs";
import { cn } from "@/lib/utils";

interface Props {
  items: Faq[];
}

export function FaqsTable({ items: propItems }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);
  const [items, setItems] = useState(propItems);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setItems(propItems);
    setDirty(false);
  }, [propItems]);

  const handleToggle = (item: Faq, next: boolean) => {
    startTransition(async () => {
      const res = await toggleFaqActiveAction(item._id, next);
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
    const res = await deleteFaqAction(deleteTarget._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("FAQ deleted");
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
    const res = await reorderFaqsAction(
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
        title="No FAQs yet"
        description="Add your first Q&A pair to populate the public FAQ section."
        action={{ label: "Add FAQ", href: "/admin/faqs/new" }}
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
            <TableHead>Question</TableHead>
            <TableHead className="hidden md:table-cell">Group</TableHead>
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
              <TableCell className="max-w-xl">
                <Link
                  href={`/admin/faqs/${item._id}/edit`}
                  className="hover:text-primary block transition-colors"
                >
                  <p className="text-foreground line-clamp-1 text-sm font-medium">
                    {item.question}
                  </p>
                  <p className="text-muted-foreground line-clamp-1 text-xs">
                    {item.answer}
                  </p>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground hidden text-xs md:table-cell">
                {item.group ?? "—"}
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
                    <Link href={`/admin/faqs/${item._id}/edit`}>
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
        title="Delete this FAQ?"
        description="Removes it from the public FAQ section. Can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
