"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createWorkAction,
  updateWorkAction,
  type WorkInput,
} from "@/lib/api/works-actions";
import type { Work } from "@/lib/api/works";

interface Props {
  mode: "create" | "edit";
  initial?: Work;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const stringifyArray = (arr?: string[]) => (arr ?? []).join(", ");
const parseTags = (s: string) =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export function WorkForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [type, setType] = useState(initial?.type ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [tagSlugs, setTagSlugs] = useState(stringifyArray(initial?.tag_slugs));
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);
  const [calendlyUrl, setCalendlyUrl] = useState(initial?.calendly_url ?? "");

  const handleTitleChange = (next: string) => {
    setTitle(next);
    if (!slugTouched && mode === "create") setSlug(slugify(next));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !type || !title || !description || !image || !imageAlt) {
      toast.error("Required fields are missing");
      return;
    }
    setSaving(true);
    const payload: WorkInput = {
      slug: slug.trim(),
      type: type.trim(),
      title: title.trim(),
      description: description.trim(),
      image,
      image_alt: imageAlt.trim(),
      tag_slugs: parseTags(tagSlugs),
      order,
      is_published: isPublished,
      calendly_url: calendlyUrl || undefined,
    };
    const res =
      mode === "create"
        ? await createWorkAction(payload)
        : await updateWorkAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Work created" : "Work updated");
    router.push("/admin/works");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-3xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New work" : "Edit work"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Works", href: "/admin/works" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Type / Industry <span className="text-destructive">*</span>
              </Label>
              <Input
                id="type"
                required
                placeholder="Hospitality"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                required
                pattern="^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
                placeholder="hudson-hospitality"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
              />
              <p className="text-muted-foreground text-xs">
                Lowercase, numbers, hyphens. Auto-derived from title on new entries.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Card description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              required
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              {description.length} / 1000
            </p>
          </div>

          <ImageInput
            label="Cover image"
            required
            description="Used on the card and the case study hero."
            value={image}
            onChange={setImage}
            previewAspect="16/9"
          />

          <div className="space-y-2">
            <Label htmlFor="image_alt">
              Image alt <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image_alt"
              required
              maxLength={200}
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag_slugs">Tags</Label>
            <Input
              id="tag_slugs"
              placeholder="Hospitality, Brand Films, Campaign Execution"
              value={tagSlugs}
              onChange={(e) => setTagSlugs(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Comma-separated. Used on the case study detail page.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="calendly_url">Calendly URL (optional)</Label>
              <Input
                id="calendly_url"
                type="url"
                placeholder="https://calendly.com/…"
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_published">Published</Label>
            <div className="flex h-9 items-center gap-2">
              <Switch
                id="is_published"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <span className="text-muted-foreground text-sm">
                {isPublished ? "Visible on the public site" : "Hidden — draft"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deep case-study fields</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Hero stats, client profile, situation/challenge/solution/outcome
            sections, outcome video and testimonial are kept on the record and
            rendered on the public case study page. Inline editing for these is
            on the polish backlog — for now they can be set via the API directly
            or left empty (the page still renders a card-only entry).
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/works")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Create work" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
