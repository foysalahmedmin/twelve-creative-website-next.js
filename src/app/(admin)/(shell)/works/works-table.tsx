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
  deleteWorkAction,
  togglePublishWorkAction,
} from "@/lib/api/works-actions";
import type { Work } from "@/lib/api/works";

interface Props {
  items: Work[];
}

export function WorksTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);

  const handleToggle = (item: Work, next: boolean) => {
    startTransition(async () => {
      const res = await togglePublishWorkAction(item._id, next, item.slug);
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
    const res = await deleteWorkAction(deleteTarget._id, deleteTarget.slug);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Work deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No works yet</p>
        <p className="text-muted-foreground text-sm">
          Add a case study to populate the public Works page.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/works/new">Add work</Link>
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
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Slug</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[110px]">Published</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="text-muted-foreground tabular-nums">
                {item.order}
              </TableCell>
              <TableCell className="max-w-xs">
                <Link
                  href={`/admin/works/${item._id}/edit`}
                  className="hover:text-primary text-sm font-medium transition-colors"
                >
                  <span className="line-clamp-1">{item.title}</span>
                  <span className="text-muted-foreground line-clamp-1 text-xs font-normal">
                    {item.description}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground hidden text-xs md:table-cell">
                {item.type}
              </TableCell>
              <TableCell className="text-muted-foreground hidden font-mono text-xs md:table-cell">
                {item.slug}
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={item.is_published ? "Published" : "Draft"}
                  tone={item.is_published ? "positive" : "neutral"}
                />
              </TableCell>
              <TableCell>
                <Switch
                  checked={item.is_published}
                  disabled={pending}
                  onCheckedChange={(next) => handleToggle(item, next)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/works/${item._id}/edit`}>
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
        title={`Delete ${deleteTarget?.title ?? "work"}?`}
        description="Removes the case study from the public site. Can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
