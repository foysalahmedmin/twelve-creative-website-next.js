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
import { Textarea } from "@/components/ui/textarea";
import {
  createTestimonialAction,
  updateTestimonialAction,
  type TestimonialInput,
} from "@/lib/api/testimonials-actions";
import type { Testimonial } from "@/lib/api/testimonials";
import type { IndustrySummary } from "@/lib/api/industries";

interface TestimonialFormProps {
  mode: "create" | "edit";
  initial?: Testimonial;
  industries: IndustrySummary[];
  industriesError?: string;
}

export function TestimonialForm({
  mode,
  initial,
  industries,
  industriesError,
}: TestimonialFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const isUploading = activeUploads > 0;
  const reportUploading = (uploading: boolean) =>
    setActiveUploads((count) => Math.max(0, count + (uploading ? 1 : -1)));

  const [form, setForm] = useState<TestimonialInput>({
    industry: initial?.industry?._id ?? "",
    name: initial?.name ?? "",
    designation: initial?.designation ?? "",
    image: initial?.image ?? "",
    category: initial?.category ?? "message",
    message: initial?.message ?? "",
    video_message: initial?.video_message ?? null,
    thumbnail: initial?.thumbnail ?? "",
    order: initial?.order ?? 0,
    is_active: initial?.is_active ?? true,
  });

  const set = <K extends keyof TestimonialInput>(
    key: K,
    value: TestimonialInput[K],
  ) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      toast.error("Please wait for media uploads to finish.");
      return;
    }

    const payload: TestimonialInput = { ...form };
    if (!payload.industry) {
      toast.error("Industry is required.");
      return;
    }
    if (payload.category === "message") {
      if ((payload.message?.trim().length ?? 0) < 10) {
        toast.error("Message must be at least 10 characters.");
        return;
      }
      payload.message = payload.message?.trim();
      payload.video_message = null;
      payload.thumbnail = "";
    } else {
      if (!payload.video_message) {
        toast.error("Video is required for a video testimonial.");
        return;
      }
      if (
        payload.video_message.source !== "youtube" &&
        !payload.thumbnail?.trim()
      ) {
        toast.error(
          "A thumbnail is required for direct URL and uploaded videos.",
        );
        return;
      }
      payload.message = "";
    }

    setSaving(true);
    try {
      const res =
        mode === "create"
          ? await createTestimonialAction(payload)
          : await updateTestimonialAction(initial!._id, payload);

      if (!res.ok) {
        toast.error(res.error ?? "Save failed");
        return;
      }
      toast.success(
        mode === "create" ? "Testimonial created" : "Testimonial updated",
      );
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const isVideo = form.category === "video_message";

  return (
    <form
      onSubmit={handleSubmit}
      className="container max-w-3xl space-y-6 py-8"
    >
      <AdminPageHeader
        title={mode === "create" ? "New testimonial" : "Edit testimonial"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Testimonials", href: "/admin/testimonials" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <IndustrySelect
            industries={industries}
            currentIndustry={initial?.industry ?? undefined}
            value={form.industry}
            onValueChange={(value) => set("industry", value)}
            loadError={industriesError}
            disabled={saving}
            description="Controls which Industry page can display this testimonial."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">
                Designation <span className="text-destructive">*</span>
              </Label>
              <Input
                id="designation"
                required
                placeholder="Owner, Casa del Mar Restaurant Group"
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
              />
            </div>
          </div>

          <ImageInput
            label="Headshot"
            required
            description="Square image works best (1:1). Shown next to the quote."
            value={form.image}
            onChange={(url) => set("image", url)}
            onUploadingChange={reportUploading}
            allowRelative
            previewAspect="1/1"
          />

          <div className="space-y-2">
            <Label>
              Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                set("category", v as TestimonialInput["category"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="message">Text testimonial</SelectItem>
                <SelectItem value="video_message">Video testimonial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isVideo && (
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                required
                minLength={10}
                rows={5}
                maxLength={400}
                placeholder="Short quote (max 400 chars)…"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                {form.message?.length ?? 0} / 400
              </p>
            </div>
          )}

          {isVideo && (
            <>
              <VideoInput
                label="Video"
                required
                value={form.video_message ?? null}
                onChange={(v) => set("video_message", v)}
                onUploadingChange={reportUploading}
                description="YouTube, direct URL, or upload."
              />
              <ImageInput
                label={`Thumbnail${form.video_message?.source === "youtube" ? " (optional)" : ""}`}
                required={
                  Boolean(form.video_message) &&
                  form.video_message?.source !== "youtube"
                }
                description="Used as the video poster. YouTube can auto-derive one; direct URL and uploaded videos require it."
                value={form.thumbnail ?? ""}
                onChange={(url) => set("thumbnail", url)}
                onUploadingChange={reportUploading}
                allowRelative
                previewAspect="16/9"
              />
            </>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
              />
              <p className="text-muted-foreground text-xs">
                Lower numbers appear first on the public site.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Active</Label>
              <div className="flex h-9 items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active ?? true}
                  onCheckedChange={(v) => set("is_active", v)}
                />
                <span className="text-muted-foreground text-sm">
                  {form.is_active ? "Visible on the public site" : "Hidden"}
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
          onClick={() => router.push("/admin/testimonials")}
          disabled={saving || isUploading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || isUploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {isUploading
            ? "Uploading media…"
            : mode === "create"
              ? "Create"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
