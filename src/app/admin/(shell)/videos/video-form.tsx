"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IndustrySelect } from "@/components/admin/industry-select";
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
  createShowcaseVideoAction,
  updateShowcaseVideoAction,
  type ShowcaseVideoInput,
} from "@/lib/api/showcase-videos-actions";
import type { ShowcaseAspect, ShowcaseVideo } from "@/lib/api/showcase-videos";
import type { IndustrySummary } from "@/lib/api/industries";
import type { VideoRef } from "@/lib/admin/types";

interface VideoFormProps {
  mode: "create" | "edit";
  initial?: ShowcaseVideo;
  industries: IndustrySummary[];
  industriesError?: string;
}

export function VideoForm({
  mode,
  initial,
  industries,
  industriesError,
}: VideoFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [industryId, setIndustryId] = useState(initial?.industry?._id ?? "");
  const [video, setVideo] = useState<VideoRef | null>(initial?.video ?? null);
  const [thumbnail, setThumbnail] = useState<string>(initial?.thumbnail ?? "");
  const [alt, setAlt] = useState<string>(initial?.alt ?? "");
  const [aspect, setAspect] = useState<ShowcaseAspect>(
    initial?.aspect ?? "reel",
  );
  const [order, setOrder] = useState<number>(initial?.order ?? 0);
  const [isActive, setIsActive] = useState<boolean>(initial?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !industryId ||
      !video ||
      !alt.trim() ||
      (video.source !== "youtube" && !thumbnail.trim())
    ) {
      toast.error(
        "Industry, video, alt text, and a thumbnail for non-YouTube video are required",
      );
      return;
    }
    setSaving(true);

    const payload: ShowcaseVideoInput = {
      industry: industryId,
      video,
      thumbnail: thumbnail || undefined,
      alt: alt.trim(),
      aspect,
      order,
      is_active: isActive,
    };

    const res =
      mode === "create"
        ? await createShowcaseVideoAction(payload)
        : await updateShowcaseVideoAction(initial!._id, payload);

    setSaving(false);

    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Video added" : "Video updated");
    router.push("/admin/videos");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container max-w-3xl space-y-6 py-8"
    >
      <AdminPageHeader
        title={mode === "create" ? "New showcase video" : "Edit showcase video"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Showcase Videos", href: "/admin/videos" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <IndustrySelect
            industries={industries}
            currentIndustry={initial?.industry}
            value={industryId}
            onValueChange={setIndustryId}
            loadError={industriesError}
            disabled={saving}
            description="Lets public Industry pages request only videos that belong to this Industry."
          />

          <VideoInput
            label="Video"
            required
            value={video}
            onChange={setVideo}
            description="YouTube, direct URL, or upload. Use media that matches the selected aspect."
          />

          <div className="space-y-2">
            <Label>
              Aspect <span className="text-destructive">*</span>
            </Label>
            <Select
              value={aspect}
              onValueChange={(v) => setAspect(v as ShowcaseAspect)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reel">
                  Reel (9:16) — appears in the vertical showcase
                </SelectItem>
                <SelectItem value="landscape">
                  Landscape (16:9) — appears in Work Showcase grid
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Decides which public surface the video shows on.
            </p>
          </div>

          <ImageInput
            label={
              video?.source === "youtube" ? "Thumbnail (optional)" : "Thumbnail"
            }
            required={Boolean(video && video.source !== "youtube")}
            description={
              aspect === "reel"
                ? "Used as the poster in the marquee. For YouTube, leave blank to auto-derive from the video."
                : "Used as the poster in the Work Showcase grid. For YouTube, leave blank to auto-derive from the video."
            }
            value={thumbnail}
            onChange={setThumbnail}
            previewAspect={aspect === "reel" ? "9/16" : "16/9"}
          />

          <div className="space-y-2">
            <Label htmlFor="alt">
              Alt text <span className="text-destructive">*</span>
            </Label>
            <Input
              id="alt"
              required
              maxLength={180}
              placeholder="Hospitality brand film — restaurant interior"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Short description for accessibility — what the video shows.
            </p>
          </div>

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
                Lower numbers appear first within the selected Industry and
                aspect.
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
          onClick={() => router.push("/admin/videos")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            saving ||
            Boolean(industriesError) ||
            (!initial?.industry && industries.length === 0) ||
            !industryId
          }
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add video" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
