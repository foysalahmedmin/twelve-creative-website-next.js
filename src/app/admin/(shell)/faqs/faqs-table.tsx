"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
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
  toggleFaqActiveAction,
} from "@/lib/api/faqs-actions";
import type { Faq } from "@/lib/api/faqs";

interface Props {
  items: Faq[];
}

export function FaqsTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null);

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No FAQs yet</p>
        <p className="text-muted-foreground text-sm">
          Add your first Q&amp;A pair to populate the public FAQ section.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/faqs/new">Add FAQ</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Order</TableHead>
            <TableHead>Question</TableHead>
            <TableHead className="hidden md:table-cell">Group</TableHead>
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
