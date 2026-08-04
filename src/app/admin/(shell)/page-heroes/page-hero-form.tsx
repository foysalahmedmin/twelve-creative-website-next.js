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
  const [uploadingFields, setUploadingFields] = useState(0);
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
    seo_title: initial?.seo?.title ?? "",
    seo_description: initial?.seo?.description ?? "",
    canonical_url: initial?.seo?.canonical_url ?? "",
    no_index: initial?.seo?.no_index ?? false,
    is_active: initial?.is_active ?? true,
  });
  const [thumbnail, setThumbnail] = useState<string>(initial?.thumbnail ?? "");
  const [video, setVideo] = useState<VideoRef | null>(
    initial?.video
      ? { source: initial.video.source, value: initial.video.value }
      : null,
  );
  const [ogImage, setOgImage] = useState(initial?.seo?.og_image ?? "");
  const isUploading = uploadingFields > 0;
  const reportUploading = (uploading: boolean) =>
    setUploadingFields((count) => Math.max(0, count + (uploading ? 1 : -1)));

  const update = (key: keyof typeof form, value: string | boolean) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) {
      toast.error("Please wait for media uploads to finish.");
      return;
    }
    const primaryCtaStarted =
      Boolean(form.primary_cta_label.trim()) ||
      Boolean(form.primary_cta_href.trim());
    const secondaryCtaStarted =
      Boolean(form.secondary_cta_label.trim()) ||
      Boolean(form.secondary_cta_href.trim());
    if (
      isHome &&
      ((primaryCtaStarted &&
        (!form.primary_cta_label.trim() || !form.primary_cta_href.trim())) ||
        (secondaryCtaStarted &&
          (!form.secondary_cta_label.trim() ||
            !form.secondary_cta_href.trim())))
    ) {
      toast.error("Complete both the label and link for each CTA, or clear both fields.");
      return;
    }
    setSaving(true);
    try {
      const res = await upsertPageHeroAction(page, {
        // Empty strings are intentional values. The API omits `undefined`, which
        // would otherwise leave a previously-saved value in place.
        label: form.label.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        thumbnail: thumbnail || null,
        video: video ?? null,
        trust_label: isHome ? form.trust_label.trim() : undefined,
        primary_cta:
          isHome && primaryCtaStarted
            ? {
                label: form.primary_cta_label.trim(),
                href: form.primary_cta_href.trim(),
              }
            : isHome
              ? null
              : undefined,
        secondary_cta:
          isHome && secondaryCtaStarted
            ? {
                label: form.secondary_cta_label.trim(),
                href: form.secondary_cta_href.trim(),
              }
            : isHome
              ? null
              : undefined,
        seo: {
          title: form.seo_title.trim() || undefined,
          description: form.seo_description.trim() || undefined,
          og_image: ogImage.trim() || undefined,
          canonical_url: form.canonical_url.trim() || undefined,
          no_index: form.no_index,
        },
        is_active: form.is_active,
      });
      if (!res.ok) {
        toast.error(res.error ?? "Save failed");
        return;
      }
      toast.success("Hero updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
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
        description="Shown as the video poster before it plays, or as a standalone preview image. Recommended for uploaded/direct videos; YouTube can generate one automatically."
        value={thumbnail}
        onChange={setThumbnail}
        onUploadingChange={reportUploading}
        allowRelative
        previewAspect="16/9"
      />

      {/* Video (optional for all pages) */}
      <VideoInput
        label="Background video (optional)"
        description="Shown below the hero text. YouTube, direct URL, or upload."
        value={video}
        onChange={setVideo}
        onUploadingChange={reportUploading}
      />

      <section className="border-border space-y-5 rounded-xl border p-5">
        <div>
          <h3 className="text-foreground text-sm font-semibold">SEO & Sharing</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Optional search and social overrides. Empty fields use the page defaults.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_title">SEO title</Label>
          <Input
            id="seo_title"
            maxLength={200}
            value={form.seo_title}
            onChange={(e) => update("seo_title", e.target.value)}
            placeholder="Search result title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_description">SEO description</Label>
          <Textarea
            id="seo_description"
            rows={3}
            maxLength={320}
            value={form.seo_description}
            onChange={(e) => update("seo_description", e.target.value)}
            placeholder="Search and social description"
          />
          <p className="text-muted-foreground text-xs">
            {form.seo_description.length} / 320
          </p>
        </div>
        <ImageInput
          label="Social share image"
          description="Recommended 1200×630. URL or uploaded image."
          value={ogImage}
          onChange={setOgImage}
          onUploadingChange={reportUploading}
          allowRelative
          previewAspect="1200/630"
        />
        <div className="space-y-2">
          <Label htmlFor="canonical_url">Canonical URL</Label>
          <Input
            id="canonical_url"
            type="url"
            value={form.canonical_url}
            onChange={(e) => update("canonical_url", e.target.value)}
            placeholder="https://twelvecreative.io/..."
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label htmlFor="no_index">Hide from search engines</Label>
            <p className="text-muted-foreground text-xs">
              Adds noindex and nofollow metadata to this page.
            </p>
          </div>
          <Switch
            id="no_index"
            checked={form.no_index}
            onCheckedChange={(value) => update("no_index", value)}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || isUploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {isUploading ? "Uploading media…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
