"use client";

import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { resolveVideo } from "@/lib/media/video";
import {
  deleteShowcaseVideoAction,
  reorderShowcaseVideosAction,
  toggleShowcaseVideoActiveAction,
} from "@/lib/api/showcase-videos-actions";
import type { ShowcaseAspect, ShowcaseVideo } from "@/lib/api/showcase-videos";
import { cn } from "@/lib/utils";

interface Props {
  items: ShowcaseVideo[];
  reorderScope?: {
    industry: string;
    aspect: ShowcaseAspect;
  };
  reorderDisabledReason?: string;
}

const SOURCE_TONE = {
  youtube: "danger" as const,
  url: "info" as const,
  upload: "positive" as const,
};

export function ShowcaseVideosTable({
  items: propItems,
  reorderScope,
  reorderDisabledReason,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ShowcaseVideo | null>(null);
  const [items, setItems] = useState(propItems);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const handleToggle = (item: ShowcaseVideo, next: boolean) => {
    startTransition(async () => {
      const res = await toggleShowcaseVideoActiveAction(item._id, next);
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
    const res = await deleteShowcaseVideoAction(deleteTarget._id);
    if (!res.ok) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Video deleted");
    setDeleteTarget(null);
    router.refresh();
  };

  const handleDrop = (targetId: string) => {
    if (!reorderScope || !dragId || dragId === targetId) return;
    const from = items.findIndex((i) => i._id === dragId);
    const to = items.findIndex((i) => i._id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDirty(true);
    setDragId(null);
  };

  const handleSaveOrder = async () => {
    if (!reorderScope) {
      toast.error("Select one Industry and aspect before reordering");
      return;
    }
    setSaving(true);
    const res = await reorderShowcaseVideosAction(
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
        title="No showcase videos found"
        description="Add a video or change the Industry and aspect filters."
        action={{ label: "Add video", href: "/admin/videos/new" }}
      />
    );
  }

  return (
    <>
      {!reorderScope ? (
        <div className="bg-muted/30 border-b px-4 py-2.5">
          <p className="text-muted-foreground text-xs">
            {reorderDisabledReason ??
              "Select one Industry and one aspect to reorder videos within that group."}
          </p>
        </div>
      ) : null}
      {dirty && (
        <div className="bg-muted/40 flex items-center justify-between border-b px-4 py-2">
          <p className="text-muted-foreground text-xs">Unsaved order changes</p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setItems(propItems);
                setDirty(false);
              }}
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
            <TableHead className="w-[60px]">Order</TableHead>
            <TableHead className="w-[100px]">Poster</TableHead>
            <TableHead>Alt</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Aspect</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[100px]">Active</TableHead>
            <TableHead className="w-[120px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const preview = resolveVideo(item.video, item.thumbnail);
            return (
              <TableRow
                key={item._id}
                draggable={Boolean(reorderScope) && !saving}
                onDragStart={() =>
                  reorderScope && !saving && setDragId(item._id)
                }
                onDragOver={(e) =>
                  reorderScope && !saving && e.preventDefault()
                }
                onDrop={() => reorderScope && !saving && handleDrop(item._id)}
                onDragEnd={() => setDragId(null)}
                className={cn(dragId === item._id && "opacity-40")}
              >
                <TableCell>
                  {reorderScope ? (
                    <GripVertical className="text-muted-foreground size-4 cursor-grab active:cursor-grabbing" />
                  ) : (
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {item.order}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "border-border/60 bg-muted relative w-12 overflow-hidden rounded",
                      item.aspect === "landscape"
                        ? "aspect-video"
                        : "aspect-[9/16]",
                    )}
                  >
                    {preview?.posterUrl ? (
                      <img
                        src={preview.posterUrl}
                        alt={item.alt}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-foreground line-clamp-2 max-w-md text-sm font-medium">
                    {item.alt}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-foreground text-sm font-medium">
                    {item.industry?.name ?? "Unassigned"}
                  </p>
                  {item.industry && !item.industry.is_active ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Industry inactive
                    </p>
                  ) : null}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={item.aspect === "landscape" ? "Landscape" : "Reel"}
                    tone={item.aspect === "landscape" ? "info" : "neutral"}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={item.video.source}
                    tone={SOURCE_TONE[item.video.source]}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.is_active}
                    disabled={pending || dirty || saving}
                    onCheckedChange={(next) => handleToggle(item, next)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className={cn(dirty && "pointer-events-none opacity-50")}
                    >
                      <Link
                        href={`/admin/videos/${item._id}/edit`}
                        aria-disabled={dirty}
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={dirty || saving}
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
        title="Delete this video?"
        description="This removes it from public showcase surfaces. It can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
