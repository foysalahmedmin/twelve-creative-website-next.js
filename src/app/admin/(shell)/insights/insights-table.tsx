"use client";

import { format } from "date-fns";
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
  deleteInsightAction,
  togglePublishInsightAction,
} from "@/lib/api/insights-actions";
import type { Insight } from "@/lib/api/insights";

interface Props {
  items: Insight[];
}

export function InsightsTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Insight | null>(null);

  const handleToggle = (item: Insight, next: boolean) => {
    startTransition(async () => {
      const res = await togglePublishInsightAction(
        item._id,
        next ? "published" : "draft",
        item.slug,
      );
      if (!res.ok) {
        toast.error(res.error ?? "Failed to update");
        return;
      }
      toast.success(next ? "Published" : "Moved to draft");
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteInsightAction(deleteTarget._id, deleteTarget.slug);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Article deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No articles yet</p>
        <p className="text-muted-foreground text-sm">
          Write your first article to populate the public /blogs page.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/insights/new">Add article</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[100px]">Published</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="max-w-xs">
                <Link
                  href={`/admin/insights/${item._id}/edit`}
                  className="hover:text-primary block transition-colors"
                >
                  <p className="text-foreground line-clamp-1 text-sm font-medium">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground line-clamp-1 font-mono text-xs">
                    /{item.slug}
                  </p>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground hidden text-xs md:table-cell">
                {item.category ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground hidden whitespace-nowrap text-xs md:table-cell">
                {format(new Date(item.updated_at), "d MMM yy")}
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={item.status === "published" ? "Published" : "Draft"}
                  tone={item.status === "published" ? "positive" : "neutral"}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.status === "published"}
                  disabled={pending}
                  onCheckedChange={(next) => handleToggle(item, next)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/insights/${item._id}/edit`}>
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
        title={`Delete ${deleteTarget?.title ?? "article"}?`}
        description="Removes from the public /blogs section. Can be restored from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
