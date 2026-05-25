"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { VideoInput } from "@/components/admin/inputs/video-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { VideoRef } from "@/lib/admin/types";
import type { ApiPageHero } from "@/lib/api/page-heroes";
import { PAGE_LABELS } from "@/lib/api/page-heroes.constants";
import type { PageKey } from "@/lib/api/page-heroes.constants";
import { upsertPageHeroAction } from "@/lib/api/page-heroes-actions";

interface Props {
  page: PageKey;
  initial: ApiPageHero | null;
}

export function PageHeroForm({ page, initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isHome = page === "home";

  const [form, setForm] = useState({
    label: initial?.label ?? "",
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    trust_label: initial?.trust_label ?? "",
    primary_cta_label: initial?.primary_cta?.label ?? "",
    primary_cta_href: initial?.primary_cta?.href ?? "",
    secondary_cta_label: initial?.secondary_cta?.label ?? "",
    secondary_cta_href: initial?.secondary_cta?.href ?? "",
    is_active: initial?.is_active ?? true,
  });
  const [thumbnail, setThumbnail] = useState<string>(initial?.thumbnail ?? "");
  const [video, setVideo] = useState<VideoRef | null>(
    initial?.video
      ? { source: initial.video.source, value: initial.video.value }
      : null,
  );

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await upsertPageHeroAction(page, {
      label: form.label || undefined,
      title: form.title || undefined,
      description: form.description || undefined,
      thumbnail: thumbnail || null,
      video: video ?? null,
      trust_label: isHome ? form.trust_label || undefined : undefined,
      primary_cta:
        isHome && form.primary_cta_label && form.primary_cta_href
          ? { label: form.primary_cta_label, href: form.primary_cta_href }
          : undefined,
      secondary_cta:
        isHome && form.secondary_cta_label && form.secondary_cta_href
          ? { label: form.secondary_cta_label, href: form.secondary_cta_href }
          : undefined,
      is_active: form.is_active,
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(res.error ?? "Save failed");
      return;
    }
    toast.success("Hero updated");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-sm font-medium">Use live data</p>
          <p className="text-muted-foreground text-xs">
            When off, the public page falls back to built-in static copy.
          </p>
        </div>
        <Switch
          checked={form.is_active}
          onCheckedChange={(v) => update("is_active", v)}
        />
      </div>

      {/* Inner-page eyebrow label (not shown on home) */}
      {!isHome && (
        <div className="space-y-2">
          <Label htmlFor="label">Eyebrow label</Label>
          <Input
            id="label"
            value={form.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder={`e.g. ${PAGE_LABELS[page]}`}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Main heading"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Short subtitle paragraph"
        />
      </div>

      {/* Home-only: trust badge */}
      {isHome && (
        <div className="space-y-2">
          <Label htmlFor="trust_label">Trust badge text</Label>
          <Input
            id="trust_label"
            value={form.trust_label}
            onChange={(e) => update("trust_label", e.target.value)}
            placeholder="e.g. Trusted across industries"
          />
        </div>
      )}

      {/* Home-only: CTAs */}
      {isHome && (
        <section className="space-y-4">
          <div>
            <h3 className="text-foreground text-sm font-semibold">
              Primary CTA
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primary_cta_label">Label</Label>
              <Input
                id="primary_cta_label"
                value={form.primary_cta_label}
                onChange={(e) => update("primary_cta_label", e.target.value)}
                placeholder="e.g. Start a Conversation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_href">Link</Label>
              <Input
                id="primary_cta_href"
                value={form.primary_cta_href}
                onChange={(e) => update("primary_cta_href", e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>
          <div>
            <h3 className="text-foreground text-sm font-semibold">
              Secondary CTA
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_label">Label</Label>
              <Input
                id="secondary_cta_label"
                value={form.secondary_cta_label}
                onChange={(e) => update("secondary_cta_label", e.target.value)}
                placeholder="e.g. View Our Work"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_href">Link</Label>
              <Input
                id="secondary_cta_href"
                value={form.secondary_cta_href}
                onChange={(e) => update("secondary_cta_href", e.target.value)}
                placeholder="/works"
              />
            </div>
          </div>
        </section>
      )}

      {/* Thumbnail */}
      <ImageInput
        label="Thumbnail / Poster image (optional)"
        description="Shown as the video poster before it plays, or as a standalone preview image. For uploaded videos this is required. YouTube videos auto-extract a thumbnail if left empty."
        value={thumbnail}
        onChange={setThumbnail}
        previewAspect="16/9"
      />

      {/* Video (optional for all pages) */}
      <VideoInput
        label="Background video (optional)"
        description="Shown below the hero text. YouTube, direct URL, or upload."
        value={video}
        onChange={setVideo}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
}
