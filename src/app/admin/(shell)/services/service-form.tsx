"use client";

import { Loader2, Plus, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { TServiceIconKey } from "@/data/services.data";
import type { ApiService } from "@/lib/api/services";
import {
  createServiceAction,
  updateServiceAction,
  type ServiceInput,
} from "@/lib/api/services-actions";

interface Props {
  mode: "create" | "edit";
  initial?: ApiService;
}

const ICON_OPTIONS: { value: TServiceIconKey; label: string }[] = [
  { value: "positioning", label: "Positioning (Target)" },
  { value: "creative", label: "Creative (Video)" },
  { value: "distribution", label: "Distribution (Megaphone)" },
  { value: "websites", label: "Websites (Globe)" },
  { value: "automation", label: "Automation (Settings)" },
  { value: "growth", label: "Growth (Analytics)" },
];

const MAX_HIGHLIGHTS = 8;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ServiceForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [highlights, setHighlights] = useState<string[]>(
    initial?.highlights?.length ? initial.highlights : [""],
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [icon, setIcon] = useState<TServiceIconKey>(
    initial?.icon ?? "positioning",
  );
  const [href, setHref] = useState(initial?.href ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleHighlightChange = (idx: number, value: string) => {
    setHighlights((prev) => prev.map((h, i) => (i === idx ? value : h)));
  };

  const handleAddHighlight = () => {
    if (highlights.length >= MAX_HIGHLIGHTS) return;
    setHighlights((prev) => [...prev, ""]);
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights((prev) =>
      prev.length === 1 ? [""] : prev.filter((_, i) => i !== idx),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedHighlights = highlights
      .map((h) => h.trim())
      .filter((h) => h.length > 0);
    const cleanSlug = slugify(slug);
    if (!title.trim() || !cleanSlug || !description.trim() || !image) {
      toast.error("Title, slug, description, and image are required");
      return;
    }
    setSaving(true);
    const payload: ServiceInput = {
      slug: cleanSlug,
      title: title.trim(),
      description: description.trim(),
      highlights: cleanedHighlights,
      image,
      icon,
      href: href.trim() || undefined,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createServiceAction(payload)
        : await updateServiceAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Service added" : "Service updated");
    router.push("/admin/services");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="container max-w-2xl space-y-6 py-8">
      <AdminPageHeader
        title={mode === "create" ? "New service" : "Edit service"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Services", href: "/admin/services" },
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
              maxLength={120}
              placeholder="Positioning & Strategy"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              required
              maxLength={80}
              placeholder="positioning"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
            />
            <p className="text-muted-foreground text-xs">
              Used as the anchor on the public page: /what-we-build#{slug || "<slug>"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              required
              minLength={10}
              maxLength={600}
              rows={3}
              placeholder="What this service is and why it matters."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Highlights</Label>
            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    maxLength={80}
                    placeholder={`Highlight ${idx + 1}`}
                    value={h}
                    onChange={(e) =>
                      handleHighlightChange(idx, e.target.value)
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveHighlight(idx)}
                    aria-label="Remove highlight"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            {highlights.length < MAX_HIGHLIGHTS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
              >
                <Plus className="size-4" />
                Add highlight
              </Button>
            )}
            <p className="text-muted-foreground text-xs">
              Up to {MAX_HIGHLIGHTS}. Shown as bullet chips on /what-we-build.
            </p>
          </div>

          <ImageInput
            label="Image"
            required
            description="Card thumbnail on home + row image on /what-we-build."
            value={image}
            onChange={setImage}
            previewAspect="16/9"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Icon <span className="text-destructive">*</span>
              </Label>
              <Select
                value={icon}
                onValueChange={(v) => setIcon(v as TServiceIconKey)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Shown on the back of the home page card.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="href">CTA link (optional)</Label>
              <Input
                id="href"
                maxLength={500}
                placeholder={`/what-we-build#${slug || "slug"}`}
                value={href}
                onChange={(e) => setHref(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Defaults to the slug anchor if left blank.
              </p>
            </div>
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
                Lower numbers appear first on both pages.
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
          onClick={() => router.push("/admin/services")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add service" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
