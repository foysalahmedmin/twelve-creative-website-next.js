"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { IndustrySummary } from "@/lib/api/industries";
import {
  deletePageCtaAction,
  savePageCtaAction,
} from "@/lib/api/page-ctas-actions";
import type {
  ApiPageCta,
  PageCtaInput,
  PageCtaPlacement,
} from "@/lib/api/page-ctas";

interface Props {
  placement: PageCtaPlacement;
  initial: ApiPageCta;
  industries: IndustrySummary[];
  industryOverride: boolean;
}

export function PageCtaForm({
  placement,
  initial,
  industries,
  industryOverride,
}: Props) {
  const router = useRouter();
  const initialIndustry =
    typeof initial.industry === "string"
      ? initial.industry
      : (initial.industry?._id ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [industry, setIndustry] = useState(initialIndustry);
  const [eyebrow, setEyebrow] = useState(initial.eyebrow ?? "");
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [image, setImage] = useState(initial.image);
  const [primaryLabel, setPrimaryLabel] = useState(initial.primary_cta.label);
  const [primaryHref, setPrimaryHref] = useState(initial.primary_cta.href);
  const [hasSecondary, setHasSecondary] = useState(
    Boolean(initial.secondary_cta),
  );
  const [secondaryLabel, setSecondaryLabel] = useState(
    initial.secondary_cta?.label ?? "",
  );
  const [secondaryHref, setSecondaryHref] = useState(
    initial.secondary_cta?.href ?? "",
  );
  const [isActive, setIsActive] = useState(initial.is_active !== false);
  const isUploading = activeUploads > 0;
  const reportUploading = (uploading: boolean) =>
    setActiveUploads((count) => Math.max(0, count + (uploading ? 1 : -1)));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading) {
      toast.error("Wait for the image upload to finish before saving");
      return;
    }
    if (industryOverride && !industry) {
      toast.error("Choose an Industry for this override");
      return;
    }
    if (
      !title.trim() ||
      !description.trim() ||
      !image.trim() ||
      !primaryLabel.trim() ||
      !primaryHref.trim()
    ) {
      toast.error("Title, description, image, and primary CTA are required");
      return;
    }
    if (hasSecondary && (!secondaryLabel.trim() || !secondaryHref.trim())) {
      toast.error("Complete both secondary CTA fields or turn it off");
      return;
    }

    const payload: PageCtaInput = {
      placement,
      industry: industryOverride ? industry : null,
      // Preserve an explicit blank so an existing optional eyebrow can be
      // cleared instead of being omitted from the upsert payload.
      eyebrow: eyebrow.trim(),
      title,
      description,
      image,
      primary_cta: { label: primaryLabel, href: primaryHref },
      secondary_cta: hasSecondary
        ? { label: secondaryLabel, href: secondaryHref }
        : null,
      is_active: isActive,
    };
    setSaving(true);
    try {
      const result = await savePageCtaAction(payload);
      if (!result.ok) {
        toast.error(result.error ?? "Unable to save Page CTA");
        return;
      }
      toast.success(
        isActive
          ? industryOverride
            ? "Industry CTA override saved and active"
            : "Page CTA saved and active"
          : industryOverride
            ? "Industry CTA override saved as inactive and hidden"
            : "Page CTA saved as inactive and hidden publicly",
      );
      if (industryOverride) router.push("/admin/page-ctas");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to save Page CTA");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial._id || !window.confirm("Delete this managed CTA record?"))
      return;
    setDeleting(true);
    try {
      const result = await deletePageCtaAction(initial._id);
      if (!result.ok) {
        toast.error(result.error ?? "Unable to delete Page CTA");
        return;
      }
      toast.success(
        industryOverride
          ? "Industry CTA override deleted"
          : "Page CTA deleted and no longer public",
      );
      router.push("/admin/page-ctas");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to delete Page CTA");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {industryOverride && (
            <div className="space-y-2">
              <Label>Industry *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((item) => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name}
                      {item.is_active ? "" : " (inactive)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">
                {isActive ? "CTA active" : "CTA inactive and hidden"}
              </p>
              <p className="text-muted-foreground text-xs">
                {industryOverride
                  ? "When inactive, this Industry override is hidden and the active global Industry Detail CTA is used when available."
                  : "When inactive, this CTA is hidden on the public page."}
              </p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="cta-eyebrow">Eyebrow (optional)</Label>
            <Input
              id="cta-eyebrow"
              maxLength={80}
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-title">Title *</Label>
            <Input
              id="cta-title"
              required
              maxLength={300}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-description">Description *</Label>
            <Textarea
              id="cta-description"
              required
              maxLength={1200}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <ImageInput
            label="CTA image"
            description="Paste a public image URL or upload an image. Landscape 3:2 works best."
            required
            allowRelative
            previewAspect="3/2"
            value={image}
            onChange={setImage}
            onUploadingChange={reportUploading}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-3">
            <p className="text-sm font-semibold">Primary CTA *</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-label">Label</Label>
                <Input
                  id="primary-label"
                  required
                  maxLength={80}
                  value={primaryLabel}
                  onChange={(e) => setPrimaryLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-href">Link</Label>
                <Input
                  id="primary-href"
                  required
                  maxLength={2048}
                  value={primaryHref}
                  onChange={(e) => setPrimaryHref(e.target.value)}
                  placeholder="/contact"
                />
              </div>
            </div>
          </section>
          <section className="space-y-3 border-t pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Secondary CTA</p>
                <p className="text-muted-foreground text-xs">
                  Optional supporting action.
                </p>
              </div>
              <Switch
                checked={hasSecondary}
                onCheckedChange={setHasSecondary}
              />
            </div>
            {hasSecondary && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="secondary-label">Label</Label>
                  <Input
                    id="secondary-label"
                    maxLength={80}
                    value={secondaryLabel}
                    onChange={(e) => setSecondaryLabel(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-href">Link</Label>
                  <Input
                    id="secondary-href"
                    maxLength={2048}
                    value={secondaryHref}
                    onChange={(e) => setSecondaryHref(e.target.value)}
                  />
                </div>
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {initial._id ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={saving || deleting || isUploading}
          >
            {deleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Delete managed record
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={saving || deleting || isUploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {isUploading ? "Uploading…" : saving ? "Saving…" : "Save CTA"}
        </Button>
      </div>
    </form>
  );
}
