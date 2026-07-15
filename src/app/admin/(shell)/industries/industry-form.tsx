"use client";

import { Loader2, Plus, X } from "lucide-react";
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
import type { TIndustryIconKey } from "@/data/industries.data";
import type { ApiIndustry } from "@/lib/api/industries";
import type { VideoRef } from "@/lib/admin/types";
import {
  createIndustryAction,
  updateIndustryAction,
  type IndustryInput,
} from "@/lib/api/industries-actions";

interface Props {
  mode: "create" | "edit";
  initial?: ApiIndustry;
}

const ICON_OPTIONS: { value: TIndustryIconKey; label: string }[] = [
  { value: "hospitality", label: "Hospitality (Restaurant)" },
  { value: "real-estate", label: "Real Estate (Building)" },
  { value: "aviation", label: "Aviation (Airplane)" },
  {
    value: "professional-services",
    label: "Professional Services (Briefcase)",
  },
];

const MAX_WORK = 12;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function IndustryForm({ mode, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [work, setWork] = useState<string[]>(
    initial?.work?.length ? initial.work : [""],
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [icon, setIcon] = useState<TIndustryIconKey>(
    initial?.icon ?? "hospitality",
  );
  const [ctaLabel, setCtaLabel] = useState(initial?.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(initial?.cta_href ?? "");
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "");
  const [video, setVideo] = useState<VideoRef | null>(initial?.video ?? null);
  const [reelThumbnail, setReelThumbnail] = useState(
    initial?.reel_thumbnail ?? "",
  );
  const [reelVideo, setReelVideo] = useState<VideoRef | null>(
    initial?.reel_video ?? null,
  );
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleWorkChange = (idx: number, value: string) => {
    setWork((prev) => prev.map((w, i) => (i === idx ? value : w)));
  };

  const handleAddWork = () => {
    if (work.length >= MAX_WORK) return;
    setWork((prev) => [...prev, ""]);
  };

  const handleRemoveWork = (idx: number) => {
    setWork((prev) =>
      prev.length === 1 ? [""] : prev.filter((_, i) => i !== idx),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedWork = work.map((w) => w.trim()).filter((w) => w.length > 0);
    const cleanSlug = slugify(slug);
    if (
      !name.trim() ||
      !cleanSlug ||
      !headline.trim() ||
      !description.trim() ||
      !image
    ) {
      toast.error("Name, slug, headline, description, and image are required");
      return;
    }
    setSaving(true);
    const payload: IndustryInput = {
      slug: cleanSlug,
      name: name.trim(),
      headline: headline.trim(),
      description: description.trim(),
      work: cleanedWork,
      image,
      icon,
      cta_label: ctaLabel.trim() || undefined,
      cta_href: ctaHref.trim() || undefined,
      tagline: tagline.trim() || undefined,
      thumbnail: thumbnail.trim() || null,
      video: video ?? null,
      reel_thumbnail: reelThumbnail.trim() || null,
      reel_video: reelVideo ?? null,
      order,
      is_active: isActive,
    };
    const res =
      mode === "create"
        ? await createIndustryAction(payload)
        : await updateIndustryAction(initial!._id, payload);
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success(mode === "create" ? "Industry added" : "Industry updated");
    router.push("/admin/industries");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container max-w-2xl space-y-6 py-8"
    >
      <AdminPageHeader
        title={mode === "create" ? "New industry" : "Edit industry"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Industries", href: "/admin/industries" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              required
              maxLength={80}
              placeholder="Hospitality"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
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
              placeholder="hospitality"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
            />
            <p className="text-muted-foreground text-xs">
              Used as the anchor on the public page: /industries#
              {slug || "<slug>"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">
              Headline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="headline"
              required
              maxLength={200}
              placeholder="Hospitality marketing that understands the room."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Sub-section heading on the /industries page.
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
              maxLength={800}
              rows={4}
              placeholder="Why this industry — what we understand and how we help."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>What we offer</Label>
            <div className="space-y-2">
              {work.map((w, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    maxLength={80}
                    placeholder={`Offering ${idx + 1}`}
                    value={w}
                    onChange={(e) => handleWorkChange(idx, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveWork(idx)}
                    aria-label="Remove offering"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            {work.length < MAX_WORK && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddWork}
              >
                <Plus className="size-4" />
                Add offering
              </Button>
            )}
            <p className="text-muted-foreground text-xs">
              Up to {MAX_WORK}. Shown on home tab + /industries grid.
            </p>
          </div>

          <ImageInput
            label="Image"
            required
            description="Showcase image on the home tab + /industries card."
            value={image}
            onChange={setImage}
            previewAspect="4/3"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Icon <span className="text-destructive">*</span>
              </Label>
              <Select
                value={icon}
                onValueChange={(v) => setIcon(v as TIndustryIconKey)}
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
                Shown on the home tab pill.
              </p>
            </div>
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cta_label">CTA label (optional)</Label>
              <Input
                id="cta_label"
                maxLength={60}
                placeholder="Book a Call"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Reserved for future use — home tab currently shows &ldquo;Book a
                Call&rdquo;.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_href">CTA link (optional)</Label>
              <Input
                id="cta_href"
                maxLength={500}
                placeholder={`/industries#${slug || "slug"}`}
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Defaults to the slug anchor if left blank.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline (optional)</Label>
            <Input
              id="tagline"
              maxLength={120}
              placeholder="From listing to sellout."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Short badge text shown on the detail page hero.
            </p>
          </div>

          <div className="border-border/60 bg-muted/20 space-y-5 rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">
                Industry reel media
              </h3>
              <p className="text-muted-foreground text-xs">
                Dedicated portrait media for the Home Industry and Core
                Verticals sections. These assets are separate from the
                detail-page hero media below.
              </p>
            </div>

            <ImageInput
              label="Reel thumbnail (optional)"
              description="Poster image for the Industry reel. Use a 9:16 portrait crop and keep key content centered; Home displays it in a bounded 4:5 frame."
              value={reelThumbnail}
              onChange={setReelThumbnail}
              previewAspect="9/16"
            />

            <VideoInput
              label="Reel video (optional)"
              description="Short-form video used by the Home Industry and Core Verticals sections."
              value={reelVideo}
              onChange={setReelVideo}
            />
          </div>

          <div className="border-border/60 space-y-5 rounded-lg border p-4">
            <div className="space-y-1">
              <h3 className="text-foreground text-sm font-semibold">
                Industry detail page hero media
              </h3>
              <p className="text-muted-foreground text-xs">
                Used only on the individual /industries/[slug] page. The hero
                video remains independent from the Industry reel video.
              </p>
            </div>

            <ImageInput
              label="Hero thumbnail (optional)"
              description="Shown before the detail-page hero video plays."
              value={thumbnail}
              onChange={setThumbnail}
              previewAspect="16/9"
            />

            <VideoInput
              label="Hero video (optional)"
              description="Plays on the /industries/[slug] detail page hero."
              value={video}
              onChange={setVideo}
            />
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
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/industries")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Add industry" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
