"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CmsMediaInput } from "@/components/admin/inputs/cms-media-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  AboutGalleryItem,
  AboutSectionHeader,
  AboutStoryCard,
  AdminAboutPage,
} from "@/lib/api/about-page";
import {
  updateAboutPageAction,
  type AboutPageInput,
} from "@/lib/api/about-page-actions";
import { normalizeCmsMedia } from "@/lib/api/cms-media";

const MAX_STORIES = 12;
const MAX_GALLERY = 24;
const MAX_BIOGRAPHY = 6;

type HeaderKey = "mission_section" | "story_section" | "gallery_section";
type ValueKey = "mission" | "vision";

interface AboutPageFormProps {
  initial: AdminAboutPage;
}

interface VisibilityControlProps {
  id: string;
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function VisibilityControl({
  id,
  label,
  checked,
  onCheckedChange,
}: VisibilityControlProps) {
  const resolvedLabel =
    label ?? (checked ? "Visible on public page" : "Hidden on public page");
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="text-muted-foreground text-xs">
        {resolvedLabel}
      </Label>
    </div>
  );
}

function reorder<T>(items: T[], position: number, direction: -1 | 1): T[] {
  const destination = position + direction;
  if (destination < 0 || destination >= items.length) return items;
  const next = [...items];
  [next[position], next[destination]] = [next[destination], next[position]];
  return next;
}

function cleanId(): string {
  return crypto.randomUUID();
}

function mediaIsValid(media: AboutStoryCard["media"]): boolean {
  return normalizeCmsMedia(media) !== null;
}

export function AboutPageForm({ initial }: AboutPageFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<AboutPageInput>(() =>
    structuredClone(initial),
  );
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const isUploading = activeUploads > 0;
  const controlsDisabled = saving || isUploading;

  const reportUploading = (uploading: boolean) => {
    setActiveUploads((current) => Math.max(0, current + (uploading ? 1 : -1)));
  };

  const updateHeader = <Key extends keyof AboutSectionHeader>(
    section: HeaderKey,
    key: Key,
    value: AboutSectionHeader[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
  };

  const updateValue = (
    card: ValueKey,
    key: "title" | "description" | "is_visible",
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [card]: { ...current[card], [key]: value },
    }));
  };

  const updateStory = <Key extends keyof AboutStoryCard>(
    id: string,
    key: Key,
    value: AboutStoryCard[Key],
  ) => {
    setForm((current) => ({
      ...current,
      story_cards: current.story_cards.map((story) =>
        story.id === id ? { ...story, [key]: value } : story,
      ),
    }));
  };

  const addStory = () => {
    setForm((current) => {
      if (current.story_cards.length >= MAX_STORIES) return current;
      const position = current.story_cards.length;
      return {
        ...current,
        story_cards: [
          ...current.story_cards,
          {
            id: cleanId(),
            index: String(position + 1).padStart(2, "0"),
            title: "",
            description: "",
            media: { type: "image", image: "" },
            is_visible: true,
          },
        ],
      };
    });
  };

  const removeStory = (id: string) => {
    setForm((current) =>
      current.story_cards.length <= 1
        ? current
        : {
            ...current,
            story_cards: current.story_cards.filter((story) => story.id !== id),
          },
    );
  };

  const moveStory = (position: number, direction: -1 | 1) => {
    setForm((current) => ({
      ...current,
      story_cards: reorder(current.story_cards, position, direction),
    }));
  };

  const updateGallery = <Key extends keyof AboutGalleryItem>(
    id: string,
    key: Key,
    value: AboutGalleryItem[Key],
  ) => {
    setForm((current) => ({
      ...current,
      gallery: current.gallery.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addGalleryItem = () => {
    setForm((current) => {
      if (current.gallery.length >= MAX_GALLERY) return current;
      const position = current.gallery.length;
      return {
        ...current,
        gallery: [
          ...current.gallery,
          {
            id: cleanId(),
            index: String(position + 1).padStart(2, "0"),
            alt: "",
            media: { type: "image", image: "" },
            is_visible: true,
          },
        ],
      };
    });
  };

  const removeGalleryItem = (id: string) => {
    setForm((current) =>
      current.gallery.length <= 1
        ? current
        : {
            ...current,
            gallery: current.gallery.filter((item) => item.id !== id),
          },
    );
  };

  const moveGalleryItem = (position: number, direction: -1 | 1) => {
    setForm((current) => ({
      ...current,
      gallery: reorder(current.gallery, position, direction),
    }));
  };

  const updateBiography = (position: number, value: string) => {
    setForm((current) => ({
      ...current,
      founder: {
        ...current.founder,
        biography: current.founder.biography.map((paragraph, index) =>
          index === position ? value : paragraph,
        ),
      },
    }));
  };

  const addBiography = () => {
    setForm((current) =>
      current.founder.biography.length >= MAX_BIOGRAPHY
        ? current
        : {
            ...current,
            founder: {
              ...current.founder,
              biography: [...current.founder.biography, ""],
            },
          },
    );
  };

  const removeBiography = (position: number) => {
    setForm((current) =>
      current.founder.biography.length <= 1
        ? current
        : {
            ...current,
            founder: {
              ...current.founder,
              biography: current.founder.biography.filter(
                (_, index) => index !== position,
              ),
            },
          },
    );
  };

  const moveBiography = (position: number, direction: -1 | 1) => {
    setForm((current) => ({
      ...current,
      founder: {
        ...current.founder,
        biography: reorder(current.founder.biography, position, direction),
      },
    }));
  };

  const validate = (): string | null => {
    const headers = [
      ["Mission section", form.mission_section],
      ["Story section", form.story_section],
      ["Gallery section", form.gallery_section],
    ] as const;
    for (const [name, section] of headers) {
      if (
        !section.label.trim() ||
        !section.title.trim() ||
        !section.description.trim()
      ) {
        return `${name} needs a label, title, and description`;
      }
    }
    for (const [name, value] of [
      ["Mission", form.mission],
      ["Vision", form.vision],
    ] as const) {
      if (!value.title.trim() || !value.description.trim()) {
        return `${name} needs a title and description`;
      }
    }
    if (form.story_cards.length < 1 || form.story_cards.length > MAX_STORIES) {
      return `Add between 1 and ${MAX_STORIES} story cards`;
    }
    if (
      new Set(form.story_cards.map((item) => item.id)).size !==
      form.story_cards.length
    ) {
      return "Each story card must have a unique ID";
    }
    const invalidStory = form.story_cards.findIndex(
      (item) =>
        !item.title.trim() ||
        !item.description.trim() ||
        !mediaIsValid(item.media),
    );
    if (invalidStory !== -1) {
      return `Story card ${invalidStory + 1} needs a title, description, and valid media`;
    }
    if (
      !form.founder.first_name.trim() ||
      !form.founder.last_name.trim() ||
      !form.founder.title.trim() ||
      !mediaIsValid(form.founder.media)
    ) {
      return "Founder needs a first name, last name, title, and valid media";
    }
    if (
      form.founder.biography.length < 1 ||
      form.founder.biography.length > MAX_BIOGRAPHY ||
      form.founder.biography.some((paragraph) => !paragraph.trim())
    ) {
      return `Founder needs between 1 and ${MAX_BIOGRAPHY} complete biography paragraphs`;
    }
    if (form.gallery.length < 1 || form.gallery.length > MAX_GALLERY) {
      return `Add between 1 and ${MAX_GALLERY} gallery items`;
    }
    if (
      new Set(form.gallery.map((item) => item.id)).size !== form.gallery.length
    ) {
      return "Each gallery item must have a unique ID";
    }
    const invalidGallery = form.gallery.findIndex(
      (item) => !item.alt.trim() || !mediaIsValid(item.media),
    );
    if (invalidGallery !== -1) {
      return `Gallery item ${invalidGallery + 1} needs alt text and valid media`;
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading) {
      toast.error("Wait for every media upload to finish before saving");
      return;
    }
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload: AboutPageInput = {
      ...form,
      story_cards: form.story_cards.map((item, position) => ({
        ...item,
        index: String(position + 1).padStart(2, "0"),
      })),
      gallery: form.gallery.map((item, position) => ({
        ...item,
        index: String(position + 1).padStart(2, "0"),
      })),
    };

    setSaving(true);
    const result = await updateAboutPageAction(payload);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Save failed");
      return;
    }
    toast.success(
      form.is_active
        ? "About page saved and active"
        : "About page saved as inactive; managed sections are hidden publicly",
    );
    router.refresh();
  };

  const renderSectionHeader = (key: HeaderKey, heading: string) => {
    const section = form[key];
    return (
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{heading}</CardTitle>
              <CardDescription>
                Configure the public heading and section visibility.
              </CardDescription>
            </div>
            <VisibilityControl
              id={`${key}-visible`}
              checked={section.is_visible}
              onCheckedChange={(checked) =>
                updateHeader(key, "is_visible", checked)
              }
            />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${key}-label`}>
              Eyebrow label <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`${key}-label`}
              required
              maxLength={100}
              value={section.label}
              onChange={(event) =>
                updateHeader(key, "label", event.target.value)
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${key}-title`}>
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`${key}-title`}
              required
              maxLength={300}
              value={section.title}
              onChange={(event) =>
                updateHeader(key, "title", event.target.value)
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${key}-description`}>
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id={`${key}-description`}
              required
              rows={3}
              maxLength={1200}
              value={section.description}
              onChange={(event) =>
                updateHeader(key, "description", event.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Publishing</CardTitle>
          <CardDescription>
            When inactive, every managed About section is hidden on the public
            site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VisibilityControl
            id="about-page-active"
            label={
              form.is_active
                ? "About page content active"
                : "About page content inactive and hidden"
            }
            checked={form.is_active}
            onCheckedChange={(checked) =>
              setForm((current) => ({ ...current, is_active: checked }))
            }
          />
        </CardContent>
      </Card>

      <section className="space-y-4" aria-labelledby="mission-heading">
        <div>
          <h2 id="mission-heading" className="font-heading text-xl font-bold">
            Mission and vision
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the section heading and both value cards.
          </p>
        </div>
        {renderSectionHeader("mission_section", "Mission section heading")}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(["mission", "vision"] as const).map((key) => (
            <Card key={key} size="sm">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="capitalize">{key}</CardTitle>
                  <VisibilityControl
                    id={`${key}-visible`}
                    checked={form[key].is_visible}
                    onCheckedChange={(checked) =>
                      updateValue(key, "is_visible", checked)
                    }
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${key}-title`}>
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`${key}-title`}
                    required
                    maxLength={160}
                    value={form[key].title}
                    onChange={(event) =>
                      updateValue(key, "title", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${key}-description`}>
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id={`${key}-description`}
                    required
                    rows={5}
                    maxLength={1200}
                    value={form[key].description}
                    onChange={(event) =>
                      updateValue(key, "description", event.target.value)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="story-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="story-heading" className="font-heading text-xl font-bold">
              Story
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Reorder cards to control the public timeline. Up to {MAX_STORIES}
              cards are supported.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addStory}
            disabled={
              controlsDisabled || form.story_cards.length >= MAX_STORIES
            }
          >
            <Plus className="size-4" />
            Add story
          </Button>
        </div>
        {renderSectionHeader("story_section", "Story section heading")}
        <div className="space-y-4">
          {form.story_cards.map((story, position) => (
            <Card key={story.id} size="sm">
              <CardHeader className="border-b">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {story.title.trim() || `Story ${position + 1}`}
                      </CardTitle>
                      <VisibilityControl
                        id={`story-${story.id}-visible`}
                        checked={story.is_visible}
                        onCheckedChange={(checked) =>
                          updateStory(story.id, "is_visible", checked)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={controlsDisabled || position === 0}
                      onClick={() => moveStory(position, -1)}
                      aria-label={`Move story ${position + 1} up`}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        controlsDisabled ||
                        position === form.story_cards.length - 1
                      }
                      onClick={() => moveStory(position, 1)}
                      aria-label={`Move story ${position + 1} down`}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        controlsDisabled || form.story_cards.length === 1
                      }
                      onClick={() => removeStory(story.id)}
                      aria-label={`Remove story ${position + 1}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={`story-${story.id}-title`}>
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`story-${story.id}-title`}
                    required
                    maxLength={180}
                    value={story.title}
                    onChange={(event) =>
                      updateStory(story.id, "title", event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`story-${story.id}-description`}>
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id={`story-${story.id}-description`}
                    required
                    rows={5}
                    maxLength={1600}
                    value={story.description}
                    onChange={(event) =>
                      updateStory(story.id, "description", event.target.value)
                    }
                  />
                </div>
                <CmsMediaInput
                  label={`Story ${position + 1} media`}
                  required
                  value={story.media}
                  onChange={(media) => updateStory(story.id, "media", media)}
                  onUploadingChange={reportUploading}
                  imagePreviewAspect="1/1"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="founder-heading">
        <div>
          <h2 id="founder-heading" className="font-heading text-xl font-bold">
            Founder
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage the founder profile, ordered biography paragraphs, and media.
          </p>
        </div>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Founder profile</CardTitle>
                <CardDescription>
                  Image or video media is supported in the existing portrait
                  layout.
                </CardDescription>
              </div>
              <VisibilityControl
                id="founder-visible"
                checked={form.founder.is_visible}
                onCheckedChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    founder: { ...current.founder, is_visible: checked },
                  }))
                }
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="founder-eyebrow">Eyebrow</Label>
                <Input
                  id="founder-eyebrow"
                  maxLength={100}
                  value={form.founder.eyebrow ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      founder: {
                        ...current.founder,
                        eyebrow: event.target.value,
                      },
                    }))
                  }
                  placeholder="Founder & Owner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder-first-name">
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="founder-first-name"
                  required
                  maxLength={80}
                  value={form.founder.first_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      founder: {
                        ...current.founder,
                        first_name: event.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founder-last-name">
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="founder-last-name"
                  required
                  maxLength={80}
                  value={form.founder.last_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      founder: {
                        ...current.founder,
                        last_name: event.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="founder-title">
                  Role or title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="founder-title"
                  required
                  maxLength={160}
                  value={form.founder.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      founder: {
                        ...current.founder,
                        title: event.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label>Biography paragraphs</Label>
                  <p className="text-muted-foreground text-xs">
                    Paragraph order is reflected on the public page.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    controlsDisabled ||
                    form.founder.biography.length >= MAX_BIOGRAPHY
                  }
                  onClick={addBiography}
                >
                  <Plus className="size-4" />
                  Add paragraph
                </Button>
              </div>
              {form.founder.biography.map((paragraph, position) => (
                <div
                  key={`biography-${position}`}
                  className="flex items-start gap-2 rounded-xl border p-3"
                >
                  <Textarea
                    required
                    rows={4}
                    maxLength={1600}
                    value={paragraph}
                    onChange={(event) =>
                      updateBiography(position, event.target.value)
                    }
                    aria-label={`Biography paragraph ${position + 1}`}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={controlsDisabled || position === 0}
                      onClick={() => moveBiography(position, -1)}
                      aria-label={`Move biography paragraph ${position + 1} up`}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        controlsDisabled ||
                        position === form.founder.biography.length - 1
                      }
                      onClick={() => moveBiography(position, 1)}
                      aria-label={`Move biography paragraph ${position + 1} down`}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        controlsDisabled || form.founder.biography.length === 1
                      }
                      onClick={() => removeBiography(position)}
                      aria-label={`Remove biography paragraph ${position + 1}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <CmsMediaInput
              label="Founder media"
              required
              value={form.founder.media}
              onChange={(media) =>
                setForm((current) => ({
                  ...current,
                  founder: { ...current.founder, media },
                }))
              }
              onUploadingChange={reportUploading}
              imagePreviewAspect="3/4"
              videoThumbnailPreviewAspect="3/4"
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-labelledby="gallery-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="gallery-heading" className="font-heading text-xl font-bold">
              Gallery
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Reorder up to {MAX_GALLERY} accessible image or video items.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addGalleryItem}
            disabled={controlsDisabled || form.gallery.length >= MAX_GALLERY}
          >
            <Plus className="size-4" />
            Add gallery item
          </Button>
        </div>
        {renderSectionHeader("gallery_section", "Gallery section heading")}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {form.gallery.map((item, position) => (
            <Card key={item.id} size="sm">
              <CardHeader className="border-b">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {item.alt.trim() || `Gallery item ${position + 1}`}
                      </CardTitle>
                      <VisibilityControl
                        id={`gallery-${item.id}-visible`}
                        checked={item.is_visible}
                        onCheckedChange={(checked) =>
                          updateGallery(item.id, "is_visible", checked)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={controlsDisabled || position === 0}
                      onClick={() => moveGalleryItem(position, -1)}
                      aria-label={`Move gallery item ${position + 1} up`}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={
                        controlsDisabled || position === form.gallery.length - 1
                      }
                      onClick={() => moveGalleryItem(position, 1)}
                      aria-label={`Move gallery item ${position + 1} down`}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={controlsDisabled || form.gallery.length === 1}
                      onClick={() => removeGalleryItem(item.id)}
                      aria-label={`Remove gallery item ${position + 1}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor={`gallery-${item.id}-alt`}>
                    Accessible description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`gallery-${item.id}-alt`}
                    required
                    maxLength={200}
                    value={item.alt}
                    onChange={(event) =>
                      updateGallery(item.id, "alt", event.target.value)
                    }
                    placeholder="Describe this media for visitors using screen readers"
                  />
                </div>
                <CmsMediaInput
                  label={`Gallery item ${position + 1} media`}
                  required
                  value={item.media}
                  onChange={(media) => updateGallery(item.id, "media", media)}
                  onUploadingChange={reportUploading}
                  imagePreviewAspect="4/3"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="border-border bg-background/95 sticky bottom-0 z-20 flex items-center justify-between gap-4 border-t py-4 backdrop-blur">
        <p className="text-muted-foreground hidden text-xs sm:block">
          {form.is_active
            ? "Saving publishes only the sections and items marked visible."
            : "Saving keeps every managed About section inactive and hidden publicly."}
        </p>
        <Button
          type="submit"
          disabled={saving || isUploading}
          className="ml-auto min-w-40"
        >
          {(saving || isUploading) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isUploading ? "Uploading…" : saving ? "Saving…" : "Save About page"}
        </Button>
      </div>
    </form>
  );
}
