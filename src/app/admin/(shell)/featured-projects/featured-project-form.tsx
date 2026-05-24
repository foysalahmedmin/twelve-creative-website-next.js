"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { VideoInput } from "@/components/admin/inputs/video-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  createFeaturedProjectAction,
  updateFeaturedProjectAction,
  type FeaturedProjectInput,
} from "@/lib/api/featured-projects-actions";
import type {
  FeaturedProject,
  FeaturedProjectAspect,
} from "@/lib/api/featured-projects";
import type { VideoRef } from "@/lib/admin/types";

interface Props {
  mode: "create" | "edit";
  initial?: FeaturedProject;
  /**
   * Existing category strings so the admin can reuse them via autocomplete
   * datalist (no need to retype "Brand Films" perfectly).
   */
  existingCategories?: string[];
}

export function FeaturedProjectForm({
  mode,
  initial,
  existingCategories = [],
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [aspect, setAspect] = useState<FeaturedProjectAspect>(
    initial?.aspect ?? "video",
  );
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [video, setVideo] = useState<VideoRef | null>(initial?.video ?? null);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim() || !thumbnail || !video) {
      toast.error("Title, category, thumbnail, and video are required");
      return;
    }
    setSaving(true);
    const payload: FeaturedProjectInput = {
      title: title.trim(),
      category: category.trim(),
      aspect,
      thumbnail,
      video,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createFeaturedProjectAction(payload)
        : await updateFeaturedProjectAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Project added" : "Project updated");
    router.push("/admin/featured-projects");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New featured project" : "Edit featured project"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Featured Projects", href: "/admin/featured-projects" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              required
              maxLength={200}
              placeholder="Hudson Hospitality — Opening Night"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Input
              id="category"
              required
              list="featured-categories"
              maxLength={80}
              placeholder="Brand Films / Hospitality / Aviation / …"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            {existingCategories.length > 0 && (
              <datalist id="featured-categories">
                {existingCategories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            )}
            <p className="text-muted-foreground text-xs">
              Free-form tab name. Projects with the same category land in the
              same tab on the public site.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Aspect <span className="text-destructive">*</span>
            </Label>
            <Select
              value={aspect}
              onValueChange={(v) => setAspect(v as FeaturedProjectAspect)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Landscape (16:9)</SelectItem>
                <SelectItem value="reel">Reel (9:16)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              The first project added to a category locks the tab&apos;s
              aspect — keep all projects in one category the same shape.
            </p>
          </div>

          <ImageInput
            label="Thumbnail"
            required
            description="Click-to-play poster shown in the tab grid."
            value={thumbnail}
            onChange={setThumbnail}
            previewAspect={aspect === "reel" ? "9/16" : "16/9"}
          />

          <VideoInput
            label="Video"
            required
            value={video}
            onChange={setVideo}
            description="YouTube, direct URL, or upload."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
              <p className="text-muted-foreground text-xs">
                Lower numbers appear first inside each tab.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Active</Label>
              <div className="flex h-9 items-center gap-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <span className="text-muted-foreground text-sm">
                  {isActive ? "Visible publicly" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/featured-projects")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
