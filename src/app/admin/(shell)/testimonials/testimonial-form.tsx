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
import { Textarea } from "@/components/ui/textarea";
import {
  createTestimonialAction,
  updateTestimonialAction,
  type TestimonialInput,
} from "@/lib/api/testimonials-actions";
import type { Testimonial } from "@/lib/api/testimonials";

interface TestimonialFormProps {
  mode: "create" | "edit";
  initial?: Testimonial;
}

export function TestimonialForm({ mode, initial }: TestimonialFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<TestimonialInput>({
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
    setSaving(true);

    const payload: TestimonialInput = { ...form };
    if (payload.category === "message") {
      payload.video_message = null;
      payload.thumbnail = "";
    } else {
      payload.message = "";
    }

    const res =
      mode === "create"
        ? await createTestimonialAction(payload)
        : await updateTestimonialAction(initial!._id, payload);

    setSaving(false);

    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Testimonial created" : "Testimonial updated");
    router.push("/admin/testimonials");
    router.refresh();
  };

  const isVideo = form.category === "video_message";

  return (
    <form onSubmit={handleSubmit} className="container max-w-3xl space-y-6 py-8">
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
                description="YouTube, direct URL, or upload."
              />
              <ImageInput
                label="Thumbnail (optional)"
                description="Used as the video poster. For YouTube, leave blank to auto-derive from the video."
                value={form.thumbnail ?? ""}
                onChange={(url) => set("thumbnail", url)}
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
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Create" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
