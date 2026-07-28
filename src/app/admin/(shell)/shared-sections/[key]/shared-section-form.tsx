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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { normalizeCmsMedia, type CmsMedia } from "@/lib/api/cms-media";
import { saveSharedSectionAction } from "@/lib/api/shared-sections-actions";
import {
  SHARED_HEADING_KEYS,
  WHY_CHOOSE_US_ICON_KEYS,
} from "@/lib/api/shared-sections-shared";
import type {
  ApiSharedSection,
  DifferenceSection,
  GrowthSystemSection,
  OrderedTextItem,
  ScrollStatementSection,
  WhyChooseUsSection,
  WorkWithUsSection,
} from "@/lib/api/shared-sections";

const MAX_ITEMS = 12;

const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" ? crypto.randomUUID() : Date.now()}`;

function reorder<Item>(items: Item[], position: number, direction: -1 | 1) {
  const destination = position + direction;
  if (destination < 0 || destination >= items.length) return items;
  const next = [...items];
  [next[position], next[destination]] = [next[destination], next[position]];
  return next;
}

function ItemActions({
  position,
  total,
  minimum = 1,
  onMove,
  onRemove,
}: {
  position: number;
  total: number;
  minimum?: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Move up"
        disabled={position === 0}
        onClick={() => onMove(-1)}
      >
        <ArrowUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Move down"
        disabled={position === total - 1}
        onClick={() => onMove(1)}
      >
        <ArrowDown className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Remove"
        disabled={total <= minimum}
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function OptionalMediaEditor({
  label,
  value,
  onChange,
  onUploadingChange,
}: {
  label: string;
  value?: CmsMedia;
  onChange: (media: CmsMedia | undefined) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  if (!value) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange({ type: "image", image: "" })}
      >
        <Plus className="size-4" /> Add optional media
      </Button>
    );
  }
  return (
    <div className="space-y-2">
      <CmsMediaInput
        label={label}
        value={value}
        onChange={onChange}
        onUploadingChange={onUploadingChange}
        imagePreviewAspect="16/9"
      />
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onChange(undefined)}
      >
        <Trash2 className="size-4" /> Remove media
      </Button>
    </div>
  );
}

function TextItemsEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: OrderedTextItem[];
  onChange: (items: OrderedTextItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={items.length >= MAX_ITEMS}
          onClick={() =>
            onChange([...items, { id: newId("item"), index: "00", text: "" }])
          }
        >
          <Plus className="size-4" /> Add item
        </Button>
      </div>
      {items.map((item, position) => (
        <div key={item.id} className="flex items-start gap-2">
          <span className="text-muted-foreground w-7 pt-2 text-xs font-medium">
            {String(position + 1).padStart(2, "0")}
          </span>
          <Input
            value={item.text}
            maxLength={300}
            onChange={(event) =>
              onChange(
                items.map((current) =>
                  current.id === item.id
                    ? { ...current, text: event.target.value }
                    : current,
                ),
              )
            }
          />
          <ItemActions
            position={position}
            total={items.length}
            onMove={(direction) =>
              onChange(reorder(items, position, direction))
            }
            onRemove={() =>
              onChange(items.filter((current) => current.id !== item.id))
            }
          />
        </div>
      ))}
    </div>
  );
}

function mediaIsComplete(media: CmsMedia | undefined): boolean {
  return media === undefined || normalizeCmsMedia(media) !== null;
}

function validateSection(section: ApiSharedSection): string | null {
  if (!section.title.trim() || !section.description.trim()) {
    return "Title and description are required";
  }
  if (
    SHARED_HEADING_KEYS.includes(
      section.key as (typeof SHARED_HEADING_KEYS)[number],
    ) &&
    !section.label?.trim()
  ) {
    return "Heading sections require a label";
  }
  if (section.key === "difference") {
    const columns = [section.content.fragmented, section.content.connected];
    if (
      columns.some(
        (column) =>
          !column.title.trim() ||
          !column.items.length ||
          column.items.some((item) => !item.text.trim()),
      ) ||
      !mediaIsComplete(section.content.media)
    ) {
      return "Complete both Difference columns and any attached media";
    }
  }
  if (section.key === "why-choose-us") {
    if (
      !section.content.features.length ||
      section.content.features.some(
        (item) =>
          !item.title.trim() ||
          !item.description.trim() ||
          !mediaIsComplete(item.media),
      )
    ) {
      return "Complete every Why Choose Us feature and attached media";
    }
  }
  if (section.key === "growth-system") {
    if (
      !section.content.steps.length ||
      section.content.steps.some(
        (step) =>
          !step.title.trim() ||
          !step.description.trim() ||
          !normalizeCmsMedia(step.media) ||
          !step.items.length ||
          step.items.some((item) => !item.text.trim()),
      )
    ) {
      return "Every Growth System step needs copy, media, and at least one item";
    }
  }
  if (section.key === "scroll-statement") {
    if (
      !section.content.paragraphs.length ||
      section.content.paragraphs.some(
        (paragraph) =>
          !paragraph.segments.length ||
          paragraph.segments.some((segment) => !segment.text.trim()),
      )
    ) {
      return "Every statement paragraph needs at least one text segment";
    }
  }
  if (section.key === "work-with-us") {
    if (
      !section.content.cards.length ||
      section.content.cards.some(
        (card) =>
          !card.title.trim() ||
          !card.description.trim() ||
          !mediaIsComplete(card.media),
      )
    ) {
      return "Complete every Work With Us card and attached media";
    }
  }
  return null;
}

export function SharedSectionForm({ initial }: { initial: ApiSharedSection }) {
  const router = useRouter();
  const [section, setSection] = useState<ApiSharedSection>(() =>
    structuredClone(initial),
  );
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const isUploading = activeUploads > 0;
  const isHeadingOnly = SHARED_HEADING_KEYS.includes(
    section.key as (typeof SHARED_HEADING_KEYS)[number],
  );
  const reportUploading = (uploading: boolean) =>
    setActiveUploads((count) => Math.max(0, count + (uploading ? 1 : -1)));

  const updateBase = (
    key: "label" | "title" | "description" | "is_active",
    value: string | boolean,
  ) =>
    setSection((current) => ({ ...current, [key]: value }) as ApiSharedSection);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isUploading) {
      toast.error("Wait for every media upload to finish before saving");
      return;
    }
    const validationError = validateSection(section);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setSaving(true);
    const result = await saveSharedSectionAction(section);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? "Unable to save shared section");
      return;
    }
    toast.success(
      section.is_active !== false
        ? isHeadingOnly
          ? "Shared heading saved and visible"
          : "Shared section saved and active"
        : isHeadingOnly
          ? "Shared heading saved as hidden"
          : "Shared section saved as inactive and hidden publicly",
    );
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section content</CardTitle>
          <CardDescription>
            Shared copy changes everywhere this section is used.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">
                {section.is_active !== false
                  ? isHeadingOnly
                    ? "Heading visible"
                    : "Section active"
                  : isHeadingOnly
                    ? "Heading hidden"
                    : "Section inactive and hidden"}
              </p>
              <p className="text-muted-foreground text-xs">
                {isHeadingOnly
                  ? "When hidden, only this managed heading disappears; the section's dynamic items remain available."
                  : "When inactive, this managed section is hidden everywhere it is used publicly."}
              </p>
            </div>
            <Switch
              checked={section.is_active !== false}
              onCheckedChange={(value) => updateBase("is_active", value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-label">
              Label / eyebrow {isHeadingOnly ? "*" : ""}
            </Label>
            <Input
              id="section-label"
              maxLength={100}
              value={section.label ?? ""}
              onChange={(event) => updateBase("label", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-title">Title *</Label>
            <Textarea
              id="section-title"
              required
              rows={2}
              maxLength={400}
              value={section.title}
              onChange={(event) => updateBase("title", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="section-description">Description *</Label>
            <Textarea
              id="section-description"
              required
              rows={4}
              maxLength={1600}
              value={section.description}
              onChange={(event) =>
                updateBase("description", event.target.value)
              }
            />
          </div>
        </CardContent>
      </Card>

      {section.key === "difference" && (
        <DifferenceEditor
          section={section}
          onChange={setSection}
          onUploadingChange={reportUploading}
        />
      )}
      {section.key === "why-choose-us" && (
        <WhyChooseUsEditor
          section={section}
          onChange={setSection}
          onUploadingChange={reportUploading}
        />
      )}
      {section.key === "growth-system" && (
        <GrowthSystemEditor
          section={section}
          onChange={setSection}
          onUploadingChange={reportUploading}
        />
      )}
      {section.key === "scroll-statement" && (
        <ScrollStatementEditor section={section} onChange={setSection} />
      )}
      {section.key === "work-with-us" && (
        <WorkWithUsEditor
          section={section}
          onChange={setSection}
          onUploadingChange={reportUploading}
        />
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || isUploading}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          {isUploading ? "Uploading…" : saving ? "Saving…" : "Save section"}
        </Button>
      </div>
    </form>
  );
}

type EditorProps<Section> = {
  section: Section;
  onChange: React.Dispatch<React.SetStateAction<ApiSharedSection>>;
  onUploadingChange?: (uploading: boolean) => void;
};

function DifferenceEditor({
  section,
  onChange,
  onUploadingChange = () => undefined,
}: EditorProps<DifferenceSection>) {
  const update = (next: DifferenceSection["content"]) =>
    onChange({ ...section, content: next });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison</CardTitle>
        <CardDescription>
          Manage both ordered comparison columns and the optional hero media.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OptionalMediaEditor
          label="Section media"
          value={section.content.media}
          onUploadingChange={onUploadingChange}
          onChange={(media) => update({ ...section.content, media })}
        />
        {(["fragmented", "connected"] as const).map((columnKey) => {
          const column = section.content[columnKey];
          return (
            <section
              key={columnKey}
              className="space-y-4 rounded-xl border p-4"
            >
              <div className="space-y-2">
                <Label>
                  {columnKey === "fragmented"
                    ? "Fragmented column title"
                    : "Connected column title"}
                </Label>
                <Input
                  maxLength={160}
                  value={column.title}
                  onChange={(event) =>
                    update({
                      ...section.content,
                      [columnKey]: { ...column, title: event.target.value },
                    })
                  }
                />
              </div>
              <TextItemsEditor
                label="Ordered points"
                items={column.items}
                onChange={(items) =>
                  update({
                    ...section.content,
                    [columnKey]: { ...column, items },
                  })
                }
              />
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}

function WhyChooseUsEditor({
  section,
  onChange,
  onUploadingChange = () => undefined,
}: EditorProps<WhyChooseUsSection>) {
  const updateFeatures = (
    features: WhyChooseUsSection["content"]["features"],
  ) => onChange({ ...section, content: { features } });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>One to twelve ordered benefit cards.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={section.content.features.length >= MAX_ITEMS}
            onClick={() =>
              updateFeatures([
                ...section.content.features,
                {
                  id: newId("feature"),
                  index: "00",
                  icon: "strategy",
                  title: "",
                  description: "",
                },
              ])
            }
          >
            <Plus className="size-4" /> Add feature
          </Button>
        </div>
        {section.content.features.map((feature, position) => (
          <section key={feature.id} className="space-y-4 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Feature {String(position + 1).padStart(2, "0")}
              </p>
              <ItemActions
                position={position}
                total={section.content.features.length}
                onMove={(direction) =>
                  updateFeatures(
                    reorder(section.content.features, position, direction),
                  )
                }
                onRemove={() =>
                  updateFeatures(
                    section.content.features.filter(
                      (item) => item.id !== feature.id,
                    ),
                  )
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select
                  value={feature.icon}
                  onValueChange={(icon) =>
                    updateFeatures(
                      section.content.features.map((item) =>
                        item.id === feature.id
                          ? { ...item, icon: icon as typeof feature.icon }
                          : item,
                      ),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WHY_CHOOSE_US_ICON_KEYS.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon.replaceAll("-", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  maxLength={160}
                  value={feature.title}
                  onChange={(event) =>
                    updateFeatures(
                      section.content.features.map((item) =>
                        item.id === feature.id
                          ? { ...item, title: event.target.value }
                          : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                maxLength={800}
                value={feature.description}
                onChange={(event) =>
                  updateFeatures(
                    section.content.features.map((item) =>
                      item.id === feature.id
                        ? { ...item, description: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <OptionalMediaEditor
              label="Feature media"
              value={feature.media}
              onUploadingChange={onUploadingChange}
              onChange={(media) =>
                updateFeatures(
                  section.content.features.map((item) =>
                    item.id === feature.id ? { ...item, media } : item,
                  ),
                )
              }
            />
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

function GrowthSystemEditor({
  section,
  onChange,
  onUploadingChange = () => undefined,
}: EditorProps<GrowthSystemSection>) {
  const updateSteps = (steps: GrowthSystemSection["content"]["steps"]) =>
    onChange({ ...section, content: { steps } });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Growth stages</CardTitle>
        <CardDescription>
          Ordered stages with required image/video media and supporting points.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={section.content.steps.length >= MAX_ITEMS}
            onClick={() =>
              updateSteps([
                ...section.content.steps,
                {
                  id: newId("growth-step"),
                  index: "00",
                  title: "",
                  description: "",
                  media: { type: "image", image: "" },
                  items: [{ id: newId("item"), index: "00", text: "" }],
                },
              ])
            }
          >
            <Plus className="size-4" /> Add stage
          </Button>
        </div>
        {section.content.steps.map((step, position) => (
          <section key={step.id} className="space-y-4 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Stage {String(position + 1).padStart(2, "0")}
              </p>
              <ItemActions
                position={position}
                total={section.content.steps.length}
                onMove={(direction) =>
                  updateSteps(
                    reorder(section.content.steps, position, direction),
                  )
                }
                onRemove={() =>
                  updateSteps(
                    section.content.steps.filter((item) => item.id !== step.id),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                maxLength={160}
                value={step.title}
                onChange={(event) =>
                  updateSteps(
                    section.content.steps.map((item) =>
                      item.id === step.id
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                maxLength={1000}
                value={step.description}
                onChange={(event) =>
                  updateSteps(
                    section.content.steps.map((item) =>
                      item.id === step.id
                        ? { ...item, description: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <CmsMediaInput
              label="Stage media"
              required
              value={step.media}
              onChange={(media) =>
                updateSteps(
                  section.content.steps.map((item) =>
                    item.id === step.id ? { ...item, media } : item,
                  ),
                )
              }
              onUploadingChange={onUploadingChange}
              imagePreviewAspect="16/10"
            />
            <TextItemsEditor
              label="Supporting points"
              items={step.items}
              onChange={(items) =>
                updateSteps(
                  section.content.steps.map((item) =>
                    item.id === step.id ? { ...item, items } : item,
                  ),
                )
              }
            />
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

function ScrollStatementEditor({
  section,
  onChange,
}: EditorProps<ScrollStatementSection>) {
  const updateParagraphs = (
    paragraphs: ScrollStatementSection["content"]["paragraphs"],
  ) => onChange({ ...section, content: { paragraphs } });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statement paragraphs</CardTitle>
        <CardDescription>
          Each paragraph contains ordered text runs; highlighted runs render in
          brand orange.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={section.content.paragraphs.length >= 8}
            onClick={() =>
              updateParagraphs([
                ...section.content.paragraphs,
                {
                  id: newId("paragraph"),
                  index: "00",
                  segments: [
                    {
                      id: newId("segment"),
                      index: "00",
                      text: "",
                      highlight: false,
                    },
                  ],
                },
              ])
            }
          >
            <Plus className="size-4" /> Add paragraph
          </Button>
        </div>
        {section.content.paragraphs.map((paragraph, paragraphPosition) => (
          <section
            key={paragraph.id}
            className="space-y-3 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Paragraph {paragraphPosition + 1}
              </p>
              <ItemActions
                position={paragraphPosition}
                total={section.content.paragraphs.length}
                onMove={(direction) =>
                  updateParagraphs(
                    reorder(
                      section.content.paragraphs,
                      paragraphPosition,
                      direction,
                    ),
                  )
                }
                onRemove={() =>
                  updateParagraphs(
                    section.content.paragraphs.filter(
                      (item) => item.id !== paragraph.id,
                    ),
                  )
                }
              />
            </div>
            {paragraph.segments.map((segment, segmentPosition) => (
              <div
                key={segment.id}
                className="bg-muted/30 grid gap-3 rounded-lg p-3 sm:grid-cols-[1fr_auto_auto] sm:items-start"
              >
                <Textarea
                  rows={2}
                  maxLength={800}
                  value={segment.text}
                  onChange={(event) =>
                    updateParagraphs(
                      section.content.paragraphs.map((item) =>
                        item.id === paragraph.id
                          ? {
                              ...item,
                              segments: item.segments.map((current) =>
                                current.id === segment.id
                                  ? { ...current, text: event.target.value }
                                  : current,
                              ),
                            }
                          : item,
                      ),
                    )
                  }
                />
                <label className="flex items-center gap-2 pt-2 text-xs">
                  <Switch
                    checked={segment.highlight}
                    onCheckedChange={(highlight) =>
                      updateParagraphs(
                        section.content.paragraphs.map((item) =>
                          item.id === paragraph.id
                            ? {
                                ...item,
                                segments: item.segments.map((current) =>
                                  current.id === segment.id
                                    ? { ...current, highlight }
                                    : current,
                                ),
                              }
                            : item,
                        ),
                      )
                    }
                  />{" "}
                  Highlight
                </label>
                <ItemActions
                  position={segmentPosition}
                  total={paragraph.segments.length}
                  onMove={(direction) =>
                    updateParagraphs(
                      section.content.paragraphs.map((item) =>
                        item.id === paragraph.id
                          ? {
                              ...item,
                              segments: reorder(
                                item.segments,
                                segmentPosition,
                                direction,
                              ),
                            }
                          : item,
                      ),
                    )
                  }
                  onRemove={() =>
                    updateParagraphs(
                      section.content.paragraphs.map((item) =>
                        item.id === paragraph.id
                          ? {
                              ...item,
                              segments: item.segments.filter(
                                (current) => current.id !== segment.id,
                              ),
                            }
                          : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={paragraph.segments.length >= 20}
              onClick={() =>
                updateParagraphs(
                  section.content.paragraphs.map((item) =>
                    item.id === paragraph.id
                      ? {
                          ...item,
                          segments: [
                            ...item.segments,
                            {
                              id: newId("segment"),
                              index: "00",
                              text: "",
                              highlight: false,
                            },
                          ],
                        }
                      : item,
                  ),
                )
              }
            >
              <Plus className="size-4" /> Add text segment
            </Button>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

function WorkWithUsEditor({
  section,
  onChange,
  onUploadingChange = () => undefined,
}: EditorProps<WorkWithUsSection>) {
  const updateCards = (cards: WorkWithUsSection["content"]["cards"]) =>
    onChange({ ...section, content: { cards } });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cards</CardTitle>
        <CardDescription>
          Ordered sticky-scroll cards with optional supporting media.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={section.content.cards.length >= MAX_ITEMS}
            onClick={() =>
              updateCards([
                ...section.content.cards,
                {
                  id: newId("work-card"),
                  index: "00",
                  title: "",
                  description: "",
                },
              ])
            }
          >
            <Plus className="size-4" /> Add card
          </Button>
        </div>
        {section.content.cards.map((card, position) => (
          <section key={card.id} className="space-y-4 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                Card {String(position + 1).padStart(2, "0")}
              </p>
              <ItemActions
                position={position}
                total={section.content.cards.length}
                onMove={(direction) =>
                  updateCards(
                    reorder(section.content.cards, position, direction),
                  )
                }
                onRemove={() =>
                  updateCards(
                    section.content.cards.filter((item) => item.id !== card.id),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                maxLength={160}
                value={card.title}
                onChange={(event) =>
                  updateCards(
                    section.content.cards.map((item) =>
                      item.id === card.id
                        ? { ...item, title: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                maxLength={1000}
                value={card.description}
                onChange={(event) =>
                  updateCards(
                    section.content.cards.map((item) =>
                      item.id === card.id
                        ? { ...item, description: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </div>
            <OptionalMediaEditor
              label="Card media"
              value={card.media}
              onUploadingChange={onUploadingChange}
              onChange={(media) =>
                updateCards(
                  section.content.cards.map((item) =>
                    item.id === card.id ? { ...item, media } : item,
                  ),
                )
              }
            />
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
