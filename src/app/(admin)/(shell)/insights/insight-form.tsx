"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageInput } from "@/components/admin/inputs/image-input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createInsightAction,
  updateInsightAction,
  type InsightInput,
} from "@/lib/api/insights-actions";
import type { Insight } from "@/lib/api/insights";

interface Props {
  mode: "create" | "edit";
  initial?: Insight;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function InsightForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    initial?.status ?? "draft",
  );

  const handleTitleChange = (next: string) => {
    setTitle(next);
    if (!slugTouched && mode === "create") setSlug(slugify(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !title || !excerpt || !cover || !content) {
      toast.error("Required fields are missing");
      return;
    }
    setSaving(true);
    const payload: InsightInput = {
      slug: slug.trim(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      cover,
      content: content.trim(),
      category: category || undefined,
      status,
    };
    const res =
      mode === "create"
        ? await createInsightAction(payload)
        : await updateInsightAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(
      mode === "create"
        ? status === "published"
          ? "Article published"
          : "Draft saved"
        : "Article updated",
    );
    router.push("/admin/insights");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-3xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New article" : "Edit article"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Insights", href: "/admin/insights" },
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
              maxLength={160}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                required
                pattern="^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                placeholder="Positioning / Creative / …"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">
              Excerpt <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="excerpt"
              required
              rows={3}
              maxLength={280}
              placeholder="Shown on /blogs cards (max 280 chars)…"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              {excerpt.length} / 280
            </p>
          </div>

          <ImageInput
            label="Cover image"
            required
            description="16:9 works best."
            value={cover}
            onChange={setCover}
            previewAspect="16/9"
          />

          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              required
              rows={16}
              placeholder="Long-form copy. Line breaks are preserved when rendered."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-muted-foreground text-xs">
              {content.trim().split(/\s+/).filter(Boolean).length} words · plain
              text (paragraph breaks preserved)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as "draft" | "published")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Published articles appear on /blogs immediately. published_at is
              set on first publish.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/insights")}
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
