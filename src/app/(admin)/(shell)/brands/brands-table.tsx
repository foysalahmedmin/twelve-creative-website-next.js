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
  deleteBrandAction,
  toggleBrandActiveAction,
} from "@/lib/api/brands-actions";
import type { Brand } from "@/lib/api/brands";

interface Props {
  items: Brand[];
}

export function BrandsTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const handleToggle = (item: Brand, next: boolean) => {
    startTransition(async () => {
      const res = await toggleBrandActiveAction(item._id, next);
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
    const res = await deleteBrandAction(deleteTarget._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Brand deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No brands yet</p>
        <p className="text-muted-foreground text-sm">
          Add the logos you want featured in the public Brands strip.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/brands/new">Add brand</Link>
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
            <TableHead className="w-[120px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Link</TableHead>
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
                <div className="border-border/60 bg-card flex h-10 w-20 items-center justify-center overflow-hidden rounded">
                  {item.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium">{item.name}</TableCell>
              <TableCell className="text-muted-foreground hidden truncate text-xs md:table-cell">
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary"
                  >
                    {item.href}
                  </a>
                ) : (
                  "—"
                )}
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
                    <Link href={`/admin/brands/${item._id}/edit`}>
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
        title={`Delete ${deleteTarget?.name ?? "brand"}?`}
        description="Removes it from the public Brands strip. Can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
