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
import { resolveVideo } from "@/lib/media/video";
import {
  deleteShowcaseVideoAction,
  toggleShowcaseVideoActiveAction,
} from "@/lib/api/showcase-videos-actions";
import type { ShowcaseVideo } from "@/lib/api/showcase-videos";

interface Props {
  items: ShowcaseVideo[];
}

const SOURCE_TONE = {
  youtube: "danger" as const,
  url: "info" as const,
  upload: "positive" as const,
};

export function ShowcaseVideosTable({ items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ShowcaseVideo | null>(null);

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

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <p className="text-foreground text-sm font-medium">
          No videos yet
        </p>
        <p className="text-muted-foreground text-sm">
          Add your first one to populate the Visual Library marquee on the Works page.
        </p>
        <Button asChild className="mt-3">
          <Link href="/admin/videos/new">Add video</Link>
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
              <TableRow key={item._id}>
                <TableCell className="text-muted-foreground tabular-nums">
                  {item.order}
                </TableCell>
                <TableCell>
                  <div
                    className={
                      "border-border/60 bg-muted relative w-12 overflow-hidden rounded " +
                      (item.aspect === "landscape" ? "aspect-video" : "aspect-[9/16]")
                    }
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
