"use client";

import { Ban, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteAdminAccountAction,
  updateAdminAccountAction,
} from "@/lib/api/admin-users-actions";
import type { AdminAccount } from "@/lib/api/admin-users";
import type { AdminRole } from "@/lib/admin/types";

interface Props {
  items: AdminAccount[];
  currentUserId: string;
}

export function UsersTable({ items, currentUserId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  const handleRole = (item: AdminAccount, role: AdminRole) => {
    if (item._id === currentUserId) {
      toast.error("You can't change your own role.");
      return;
    }
    startTransition(async () => {
      const res = await updateAdminAccountAction(item._id, { role });
      if (!res.ok) {
        toast.error(res.error ?? "Failed to update role");
        return;
      }
      toast.success(`Role set to ${role}`);
      router.refresh();
    });
  };

  const handleBlock = (item: AdminAccount) => {
    if (item._id === currentUserId) {
      toast.error("You can't block yourself.");
      return;
    }
    const next = item.status === "blocked" ? "in-progress" : "blocked";
    startTransition(async () => {
      const res = await updateAdminAccountAction(item._id, { status: next });
      if (!res.ok) {
        toast.error(res.error ?? "Failed to update status");
        return;
      }
      toast.success(next === "blocked" ? "Account blocked" : "Account unblocked");
      router.refresh();
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget._id === currentUserId) {
      toast.error("You can't delete yourself.");
      setDeleteTarget(null);
      return;
    }
    const res = await deleteAdminAccountAction(deleteTarget._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Account deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">No admin accounts</p>
        <p className="text-muted-foreground text-sm">
          Sign up flow at <code className="bg-muted rounded px-1">/signup</code>{" "}
          will populate this list.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="w-[140px]">Role</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            <TableHead className="w-[160px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const isSelf = item._id === currentUserId;
            return (
              <TableRow key={item._id}>
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
                      <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-xs font-bold">
                        {item.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <p className="text-foreground text-sm font-medium leading-tight">
                        {item.name}
                        {isSelf && (
                          <span className="text-muted-foreground ml-1.5 text-xs font-normal">
                            (you)
                          </span>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs leading-tight">
                        {item.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={item.role}
                    disabled={pending || isSelf}
                    onValueChange={(v) => handleRole(item, v as AdminRole)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={item.status === "blocked" ? "Blocked" : "Active"}
                    tone={item.status === "blocked" ? "danger" : "positive"}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={pending || isSelf}
                      onClick={() => handleBlock(item)}
                      title={item.status === "blocked" ? "Unblock" : "Block"}
                    >
                      {item.status === "blocked" ? (
                        <ShieldCheck className="size-4" />
                      ) : (
                        <Ban className="size-4" />
                      )}
                      <span className="sr-only">
                        {item.status === "blocked" ? "Unblock" : "Block"}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isSelf}
                      onClick={() => setDeleteTarget(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.name ?? "account"}?`}
        description="They will lose admin panel access immediately. Account is soft-deleted and can be restored from the database."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
