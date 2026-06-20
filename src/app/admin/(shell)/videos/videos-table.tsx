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
import { resolveVideo } from "@/lib/media/video";
import {
  deleteShowcaseVideoAction,
  reorderShowcaseVideosAction,
  toggleShowcaseVideoActiveAction,
} from "@/lib/api/showcase-videos-actions";
import type { ShowcaseVideo } from "@/lib/api/showcase-videos";
import { cn } from "@/lib/utils";

interface Props {
  items: ShowcaseVideo[];
}

const SOURCE_TONE = {
  youtube: "danger" as const,
  url: "info" as const,
  upload: "positive" as const,
};

export function ShowcaseVideosTable({ items: propItems }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ShowcaseVideo | null>(null);
  const [items, setItems] = useState(propItems);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    setItems(propItems);
    setDirty(false);
  }, [propItems]);

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
        title="No videos yet"
        description="Add your first one to populate the Visual Library marquee on the Works page."
        action={{ label: "Add video", href: "/admin/videos/new" }}
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
            <TableHead className="w-[100px]">Poster</TableHead>
            <TableHead>Alt</TableHead>
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
                  <div
                    className={cn(
                      "border-border/60 bg-muted relative w-12 overflow-hidden rounded",
                      item.aspect === "landscape" ? "aspect-video" : "aspect-[9/16]",
                    )}
                  >
                    {preview?.posterUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
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
                    disabled={pending}
                    onCheckedChange={(next) => handleToggle(item, next)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/videos/${item._id}/edit`}>
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
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this video?"
        description="This removes it from the public Visual Library marquee. It can be restored later from soft-delete."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  );
}
