"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IndustrySelect } from "@/components/admin/industry-select";
import { ImageInput } from "@/components/admin/inputs/image-input";
import { VideoInput } from "@/components/admin/inputs/video-input";
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
import type { VideoRef } from "@/lib/admin/types";
import { isSafeVideoReference as isSafeCmsVideoReference } from "@/lib/api/cms-media";
import {
  createWorkAction,
  updateWorkAction,
  type WorkInput,
} from "@/lib/api/works-actions";
import type { IndustrySummary } from "@/lib/api/industries";
import type {
  ChallengeItem,
  HeroStat,
  Metric,
  SolutionPhase,
  Work,
  WorkClient,
  WorkIndustry,
  WorkTestimonial,
} from "@/lib/api/works";

interface Props {
  mode: "create" | "edit";
  initial?: Work;
  industries: IndustrySummary[];
  industriesError?: string;
}

type EditableMetric = Metric & { _key: string };
type EditableHeroStat = HeroStat & { _key: string };
type EditableChallenge = ChallengeItem & { _key: string };
type EditableSolutionPhase = SolutionPhase & { _key: string };

interface EditableClient {
  name: string;
  industry: string;
  domain: string;
  employees: string;
  tags: string;
  desc: string;
  logo: string;
}

interface EditableTestimonial {
  quote: string;
  avatar_url: string;
  name: string;
  role: string;
}

const MAX_METRICS = 12;
const MAX_HERO_STATS = 12;
const MAX_CHALLENGES = 20;
const MAX_SOLUTION_PHASES = 20;
const MAX_TAGS = 30;

let newRowSequence = 0;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);

const stringifyArray = (items?: string[]) => (items ?? []).join(", ");

const parseList = (value: string) =>
  Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

const makeNewKey = (prefix: string) => {
  newRowSequence += 1;
  return `${prefix}-new-${Date.now()}-${newRowSequence}`;
};

const withInitialKeys = <T extends object>(prefix: string, items?: T[]) =>
  (items ?? []).map((item, index) => ({
    ...item,
    _key: `${prefix}-initial-${index}`,
  }));

const updateRow = <T,>(items: T[], index: number, patch: Partial<T>) =>
  items.map((item, currentIndex) =>
    currentIndex === index ? { ...item, ...patch } : item,
  );

const removeRow = <T,>(items: T[], index: number) =>
  items.filter((_, currentIndex) => currentIndex !== index);

const cleanOptional = (value: string) => value.trim() || undefined;

const hasAnyValue = (values: string[]) =>
  values.some((value) => value.trim().length > 0);

const isSafeRootRelativePath = (value: string, uploadsOnly = false) => {
  const candidate = value.trim();
  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return false;
  }

  try {
    const pathname = decodeURIComponent(candidate.split(/[?#]/, 1)[0]);
    if (pathname.split("/").includes("..")) return false;
    return (
      !uploadsOnly ||
      pathname === "/uploads" ||
      pathname.startsWith("/uploads/")
    );
  } catch {
    return false;
  }
};

const isHttpUrl = (value: string) => {
  if (!value.trim()) return true;
  if (value.includes("\\")) return false;
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
};

const isSafeMediaLocation = (value: string) =>
  !value.trim() ||
  (value.trim().length <= 2048 &&
    (isSafeRootRelativePath(value) || isHttpUrl(value)));

const isSafeVideoReference = (video: VideoRef) =>
  isSafeCmsVideoReference(video.source, video.value.trim());

function getIndustryId(industry: WorkIndustry | null | undefined): string {
  return typeof industry === "string" ? industry : (industry?._id ?? "");
}

function toIndustrySummary(
  industry: WorkIndustry | null | undefined,
): IndustrySummary | undefined {
  if (!industry || typeof industry === "string") return undefined;
  return {
    _id: industry._id,
    name: industry.name,
    slug: industry.slug,
    order: industry.order ?? Number.MAX_SAFE_INTEGER,
    is_active: industry.is_active ?? true,
  };
}

function RepeaterHeader({
  title,
  description,
  count,
  max,
  addLabel,
  onAdd,
  disabled,
}: {
  title: string;
  description: string;
  count: number;
  max: number;
  addLabel: string;
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="font-heading text-foreground font-bold">{title}</h3>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          {description}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        disabled={disabled || count >= max}
        className="shrink-0"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  );
}

function RemoveRowButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="text-destructive hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}

export function WorkForm({
  mode,
  initial,
  industries,
  industriesError,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);

  const [industryId, setIndustryId] = useState(() =>
    getIndustryId(initial?.industry),
  );
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [type, setType] = useState(initial?.type ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.image_alt ?? "");
  const [tagSlugs, setTagSlugs] = useState(stringifyArray(initial?.tag_slugs));
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isPublished, setIsPublished] = useState(
    initial?.is_published ?? false,
  );
  const [calendlyUrl, setCalendlyUrl] = useState(initial?.calendly_url ?? "");

  const [metrics, setMetrics] = useState<EditableMetric[]>(() =>
    withInitialKeys("metric", initial?.metrics),
  );
  const [heroStats, setHeroStats] = useState<EditableHeroStat[]>(() =>
    withInitialKeys("hero-stat", initial?.hero_stats),
  );
  const [client, setClient] = useState<EditableClient>({
    name: initial?.client?.name ?? "",
    industry: initial?.client?.industry ?? "",
    domain: initial?.client?.domain ?? "",
    employees: initial?.client?.employees ?? "",
    tags: stringifyArray(initial?.client?.tags),
    desc: initial?.client?.desc ?? "",
    logo: initial?.client?.logo ?? "",
  });
  const [situationIntro, setSituationIntro] = useState(
    initial?.situation_intro ?? "",
  );
  const [challengeIntro, setChallengeIntro] = useState(
    initial?.challenge_intro ?? "",
  );
  const [challengeItems, setChallengeItems] = useState<EditableChallenge[]>(
    () => withInitialKeys("challenge", initial?.challenge_items),
  );
  const [solutionIntro, setSolutionIntro] = useState(
    initial?.solution_intro ?? "",
  );
  const [solutionPhases, setSolutionPhases] = useState<EditableSolutionPhase[]>(
    () => withInitialKeys("solution", initial?.solution_phases),
  );
  const [outcomeDescription, setOutcomeDescription] = useState(
    initial?.outcome_desc ?? "",
  );
  const [outcomeVideo, setOutcomeVideo] = useState<VideoRef | null>(
    initial?.outcome_video ?? null,
  );
  const [outcomeThumbnail, setOutcomeThumbnail] = useState(
    initial?.outcome_video_thumbnail ?? "",
  );
  const [testimonial, setTestimonial] = useState<EditableTestimonial>({
    quote: initial?.testimonial?.quote ?? "",
    avatar_url: initial?.testimonial?.avatar_url ?? "",
    name: initial?.testimonial?.name ?? "",
    role: initial?.testimonial?.role ?? "",
  });

  const isUploading = activeUploads > 0;
  const currentIndustry = toIndustrySummary(initial?.industry);
  const industryAvailable = Boolean(
    currentIndustry ||
    industries.some((industry) => industry._id === industryId),
  );

  const handleUploadingChange = (uploading: boolean) => {
    setActiveUploads((current) => Math.max(0, current + (uploading ? 1 : -1)));
  };

  const handleTitleChange = (next: string) => {
    setTitle(next);
    if (!slugTouched && mode === "create") setSlug(slugify(next));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploading) {
      toast.error("Wait for every media upload to finish before saving");
      return;
    }
    if (industriesError) {
      toast.error("Industries are unavailable. Refresh and try again.");
      return;
    }

    const cleanSlug = slugify(slug);
    const cleanType = type.trim();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanImage = image.trim();
    const cleanImageAlt = imageAlt.trim();

    if (
      !industryId ||
      !cleanSlug ||
      !cleanType ||
      !cleanTitle ||
      !cleanDescription ||
      !cleanImage ||
      !cleanImageAlt
    ) {
      toast.error(
        "Industry, slug, project type, title, description, cover, and image alt are required",
      );
      return;
    }
    if (cleanSlug.length < 2 || cleanTitle.length < 4) {
      toast.error(
        "Slug needs 2 characters and title needs at least 4 characters",
      );
      return;
    }
    if (!isSafeMediaLocation(cleanImage)) {
      toast.error(
        "Cover image must be an http(s) URL or a safe root-relative path",
      );
      return;
    }
    if (!isHttpUrl(calendlyUrl)) {
      toast.error("Calendly URL must use http or https");
      return;
    }
    if (!Number.isInteger(order) || order < 0) {
      toast.error("Order must be a non-negative whole number");
      return;
    }
    if (
      metrics.length > MAX_METRICS ||
      heroStats.length > MAX_HERO_STATS ||
      challengeItems.length > MAX_CHALLENGES ||
      solutionPhases.length > MAX_SOLUTION_PHASES
    ) {
      toast.error("One or more repeatable sections exceeds its allowed limit");
      return;
    }

    const cleanedTagSlugs = parseList(tagSlugs);
    if (
      cleanedTagSlugs.length > MAX_TAGS ||
      cleanedTagSlugs.some((tag) => tag.length > 80)
    ) {
      toast.error(
        `Use at most ${MAX_TAGS} project tags, with no tag longer than 80 characters`,
      );
      return;
    }

    const cleanedMetrics: Metric[] = metrics.map((metric) => {
      const sub = metric.sub?.trim();
      return {
        label: metric.label.trim(),
        value: metric.value.trim(),
        ...(sub ? { sub } : {}),
      };
    });
    const invalidMetric = cleanedMetrics.findIndex(
      (metric) => !metric.label || !metric.value,
    );
    if (invalidMetric !== -1) {
      toast.error(`Metric ${invalidMetric + 1} needs both a label and value`);
      return;
    }

    const cleanedHeroStats: HeroStat[] = heroStats.map((stat) => ({
      label: stat.label.trim(),
      value: stat.value.trim(),
    }));
    const invalidHeroStat = cleanedHeroStats.findIndex(
      (stat) => !stat.label || !stat.value,
    );
    if (invalidHeroStat !== -1) {
      toast.error(
        `Hero stat ${invalidHeroStat + 1} needs both a label and value`,
      );
      return;
    }

    const clientHasContent = hasAnyValue([
      client.name,
      client.industry,
      client.domain,
      client.employees,
      client.tags,
      client.desc,
      client.logo,
    ]);
    if (clientHasContent && !client.name.trim()) {
      toast.error(
        "Client name is required when client profile details are set",
      );
      return;
    }
    if (client.logo && !isSafeMediaLocation(client.logo)) {
      toast.error(
        "Client logo must be an http(s) URL or safe root-relative path",
      );
      return;
    }
    const cleanedClientTags = parseList(client.tags);
    if (
      cleanedClientTags.length > MAX_TAGS ||
      cleanedClientTags.some((tag) => tag.length > 80)
    ) {
      toast.error(
        `Use at most ${MAX_TAGS} client tags, with no tag longer than 80 characters`,
      );
      return;
    }
    const cleanedClient: WorkClient | null | undefined = clientHasContent
      ? {
          name: client.name.trim(),
          ...(cleanOptional(client.industry)
            ? { industry: client.industry.trim() }
            : {}),
          ...(cleanOptional(client.domain)
            ? { domain: client.domain.trim() }
            : {}),
          ...(cleanOptional(client.employees)
            ? { employees: client.employees.trim() }
            : {}),
          tags: cleanedClientTags,
          ...(cleanOptional(client.desc) ? { desc: client.desc.trim() } : {}),
          ...(cleanOptional(client.logo) ? { logo: client.logo.trim() } : {}),
        }
      : mode === "edit"
        ? null
        : undefined;

    const cleanedChallenges: ChallengeItem[] = challengeItems.map((item) => ({
      title: item.title.trim(),
      desc: item.desc.trim(),
    }));
    const invalidChallenge = cleanedChallenges.findIndex(
      (item) => !item.title || !item.desc,
    );
    if (invalidChallenge !== -1) {
      toast.error(
        `Challenge item ${invalidChallenge + 1} needs a title and description`,
      );
      return;
    }

    const cleanedPhases: SolutionPhase[] = solutionPhases.map((phase) => {
      const time = phase.time?.trim();
      return {
        phase: phase.phase.trim(),
        ...(time ? { time } : {}),
        desc: phase.desc.trim(),
      };
    });
    const invalidPhase = cleanedPhases.findIndex(
      (phase) => !phase.phase || !phase.desc,
    );
    if (invalidPhase !== -1) {
      toast.error(
        `Solution phase ${invalidPhase + 1} needs a phase name and description`,
      );
      return;
    }

    if (outcomeThumbnail && !isSafeMediaLocation(outcomeThumbnail)) {
      toast.error(
        "Outcome thumbnail must be an http(s) URL or safe root-relative path",
      );
      return;
    }
    if (outcomeVideo && !isSafeVideoReference(outcomeVideo)) {
      toast.error(
        outcomeVideo.source === "youtube"
          ? "YouTube videos require a valid HTTPS YouTube URL"
          : outcomeVideo.source === "upload"
            ? "Uploaded videos require an HTTPS URL or safe /uploads path"
            : "Direct videos require a valid HTTPS URL",
      );
      return;
    }

    const testimonialHasContent = hasAnyValue([
      testimonial.quote,
      testimonial.avatar_url,
      testimonial.name,
      testimonial.role,
    ]);
    if (
      testimonialHasContent &&
      (!testimonial.quote.trim() ||
        !testimonial.name.trim() ||
        !testimonial.role.trim())
    ) {
      toast.error(
        "Testimonial quote, client name, and role are required when a testimonial is set",
      );
      return;
    }
    if (
      testimonial.avatar_url &&
      !isSafeMediaLocation(testimonial.avatar_url)
    ) {
      toast.error(
        "Testimonial avatar must be an http(s) URL or safe root-relative path",
      );
      return;
    }
    const cleanedTestimonial: WorkTestimonial | null | undefined =
      testimonialHasContent
        ? {
            quote: testimonial.quote.trim(),
            name: testimonial.name.trim(),
            role: testimonial.role.trim(),
            ...(cleanOptional(testimonial.avatar_url)
              ? { avatar_url: testimonial.avatar_url.trim() }
              : {}),
          }
        : mode === "edit"
          ? null
          : undefined;

    const optionalText = (value: string) =>
      value.trim() || (mode === "edit" ? null : undefined);

    const payload: WorkInput = {
      industry: industryId,
      slug: cleanSlug,
      type: cleanType,
      title: cleanTitle,
      description: cleanDescription,
      image: cleanImage,
      image_alt: cleanImageAlt,
      metrics: cleanedMetrics,
      tag_slugs: cleanedTagSlugs,
      hero_stats: cleanedHeroStats,
      client: cleanedClient,
      situation_intro: optionalText(situationIntro),
      challenge_intro: optionalText(challengeIntro),
      challenge_items: cleanedChallenges,
      solution_intro: optionalText(solutionIntro),
      solution_phases: cleanedPhases,
      outcome_desc: optionalText(outcomeDescription),
      outcome_video: outcomeVideo ?? (mode === "edit" ? null : undefined),
      outcome_video_thumbnail: optionalText(outcomeThumbnail),
      testimonial: cleanedTestimonial,
      calendly_url: optionalText(calendlyUrl),
      order,
      is_published: isPublished,
    };

    setSaving(true);
    try {
      const result =
        mode === "create"
          ? await createWorkAction(payload)
          : await updateWorkAction(initial!._id, payload, initial!.slug);

      if (!result.ok) {
        toast.error(result.error ?? "Save failed");
        return;
      }

      toast.success(mode === "create" ? "Work created" : "Work updated");
      router.push("/admin/works");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container max-w-5xl space-y-6 py-8"
    >
      <AdminPageHeader
        title={mode === "create" ? "New work" : "Edit work"}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Works", href: "/admin/works" },
          { label: mode === "create" ? "New" : "Edit" },
        ]}
      />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Card and hero</CardTitle>
          <CardDescription>
            Core listing content, Industry ownership, cover media, and public
            URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <IndustrySelect
            industries={industries}
            currentIndustry={currentIndustry}
            value={industryId}
            onValueChange={setIndustryId}
            loadError={industriesError}
            disabled={saving}
            description="Required relationship used to organize and filter case studies by Industry."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Project type <span className="text-destructive">*</span>
              </Label>
              <Input
                id="type"
                required
                maxLength={80}
                placeholder="Brand film, Campaign, Website…"
                value={type}
                onChange={(event) => setType(event.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                A short display category; Industry is selected separately above.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                required
                minLength={2}
                maxLength={160}
                pattern="^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
                placeholder="hudson-hospitality"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugTouched(true);
                }}
              />
              <p className="text-muted-foreground text-xs">
                Lowercase letters, numbers, and hyphens. Auto-derived on create.
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
              minLength={4}
              maxLength={200}
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
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
              onChange={(event) => setDescription(event.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              {description.length} / 1000
            </p>
          </div>

          <ImageInput
            label="Cover image"
            required
            allowRelative
            description="Used on the listing card and case-study hero. Paste a URL or upload a file."
            value={image}
            onChange={setImage}
            onUploadingChange={handleUploadingChange}
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
              onChange={(event) => setImageAlt(event.target.value)}
              placeholder="Describe the visible cover image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag_slugs">Tags</Label>
            <Input
              id="tag_slugs"
              placeholder="Hospitality, Brand Films, Campaign Execution"
              value={tagSlugs}
              onChange={(event) => setTagSlugs(event.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Comma-separated; duplicates are removed. Maximum {MAX_TAGS} tags.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Results and hero highlights</CardTitle>
          <CardDescription>
            Metrics render in the results strip. Hero stats appear around the
            main cover; the public layout currently emphasizes the first two.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <section className="space-y-4" aria-labelledby="metrics-heading">
            <RepeaterHeader
              title="Metrics"
              description={`Add up to ${MAX_METRICS} measurable results. Label and value are required for every added row.`}
              count={metrics.length}
              max={MAX_METRICS}
              addLabel="Add metric"
              onAdd={() =>
                setMetrics((current) => [
                  ...current,
                  {
                    _key: makeNewKey("metric"),
                    label: "",
                    value: "",
                    sub: "",
                  },
                ])
              }
              disabled={saving}
            />
            <h3 id="metrics-heading" className="sr-only">
              Metrics
            </h3>
            {metrics.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                No metrics added.
              </p>
            ) : (
              <div className="space-y-3">
                {metrics.map((metric, index) => (
                  <Card key={metric._key} size="sm">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm">
                          Metric {index + 1}
                        </CardTitle>
                        <RemoveRowButton
                          label={`Remove metric ${index + 1}`}
                          onClick={() =>
                            setMetrics((current) => removeRow(current, index))
                          }
                          disabled={saving}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`metric-${index}-label`}>
                          Label <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`metric-${index}-label`}
                          required
                          maxLength={80}
                          value={metric.label}
                          onChange={(event) =>
                            setMetrics((current) =>
                              updateRow(current, index, {
                                label: event.target.value,
                              }),
                            )
                          }
                          placeholder="Revenue increase"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`metric-${index}-value`}>
                          Value <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`metric-${index}-value`}
                          required
                          maxLength={60}
                          value={metric.value}
                          onChange={(event) =>
                            setMetrics((current) =>
                              updateRow(current, index, {
                                value: event.target.value,
                              }),
                            )
                          }
                          placeholder="+42%"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`metric-${index}-sub`}>Context</Label>
                        <Input
                          id={`metric-${index}-sub`}
                          maxLength={120}
                          value={metric.sub ?? ""}
                          onChange={(event) =>
                            setMetrics((current) =>
                              updateRow(current, index, {
                                sub: event.target.value,
                              }),
                            )
                          }
                          placeholder="Within 90 days"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4" aria-labelledby="hero-stats-heading">
            <RepeaterHeader
              title="Hero stats"
              description={`Add up to ${MAX_HERO_STATS} compact highlights. The first two have dedicated hero positions.`}
              count={heroStats.length}
              max={MAX_HERO_STATS}
              addLabel="Add hero stat"
              onAdd={() =>
                setHeroStats((current) => [
                  ...current,
                  {
                    _key: makeNewKey("hero-stat"),
                    label: "",
                    value: "",
                  },
                ])
              }
              disabled={saving}
            />
            <h3 id="hero-stats-heading" className="sr-only">
              Hero stats
            </h3>
            {heroStats.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                No hero stats added.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {heroStats.map((stat, index) => (
                  <Card key={stat._key} size="sm">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm">
                          Hero stat {index + 1}
                        </CardTitle>
                        <RemoveRowButton
                          label={`Remove hero stat ${index + 1}`}
                          onClick={() =>
                            setHeroStats((current) => removeRow(current, index))
                          }
                          disabled={saving}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`hero-stat-${index}-label`}>
                          Label <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`hero-stat-${index}-label`}
                          required
                          maxLength={80}
                          value={stat.label}
                          onChange={(event) =>
                            setHeroStats((current) =>
                              updateRow(current, index, {
                                label: event.target.value,
                              }),
                            )
                          }
                          placeholder="Qualified leads"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`hero-stat-${index}-value`}>
                          Value <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`hero-stat-${index}-value`}
                          required
                          maxLength={60}
                          value={stat.value}
                          onChange={(event) =>
                            setHeroStats((current) =>
                              updateRow(current, index, {
                                value: event.target.value,
                              }),
                            )
                          }
                          placeholder="1,240"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Client profile</CardTitle>
          <CardDescription>
            Optional client context shown near the top of the case study. Client
            name becomes required once any profile field is filled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client name</Label>
              <Input
                id="client-name"
                maxLength={160}
                value={client.name}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Hudson Hospitality Group"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-industry">Client industry label</Label>
              <Input
                id="client-industry"
                maxLength={120}
                value={client.industry}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    industry: event.target.value,
                  }))
                }
                placeholder="Restaurant Group"
              />
              <p className="text-muted-foreground text-xs">
                Display snapshot only; the canonical Industry relation is above.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-domain">Domain</Label>
              <Input
                id="client-domain"
                maxLength={200}
                value={client.domain}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    domain: event.target.value,
                  }))
                }
                placeholder="hudsonhospitalitygroup.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-employees">Company size</Label>
              <Input
                id="client-employees"
                maxLength={60}
                value={client.employees}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    employees: event.target.value,
                  }))
                }
                placeholder="50–100"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client-tags">Client tags</Label>
              <Input
                id="client-tags"
                value={client.tags}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    tags: event.target.value,
                  }))
                }
                placeholder="Hospitality, Multi-location, New York"
              />
              <p className="text-muted-foreground text-xs">
                Comma-separated. Maximum {MAX_TAGS} tags.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client-description">Client description</Label>
              <Textarea
                id="client-description"
                rows={4}
                maxLength={1000}
                value={client.desc}
                onChange={(event) =>
                  setClient((current) => ({
                    ...current,
                    desc: event.target.value,
                  }))
                }
                placeholder="Background and business context for this client."
              />
            </div>
          </div>

          <ImageInput
            label="Client logo"
            allowRelative
            description="Optional square logo. Paste a URL or upload a file."
            value={client.logo}
            onChange={(value) =>
              setClient((current) => ({ ...current, logo: value }))
            }
            onUploadingChange={handleUploadingChange}
            previewAspect="1/1"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Situation and challenge</CardTitle>
          <CardDescription>
            Explain the starting context, then break the challenge into
            scannable items.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="space-y-2">
            <Label htmlFor="situation-intro">Situation</Label>
            <Textarea
              id="situation-intro"
              rows={5}
              maxLength={2000}
              value={situationIntro}
              onChange={(event) => setSituationIntro(event.target.value)}
              placeholder="What was happening before the engagement?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="challenge-intro">Challenge introduction</Label>
            <Textarea
              id="challenge-intro"
              rows={5}
              maxLength={2000}
              value={challengeIntro}
              onChange={(event) => setChallengeIntro(event.target.value)}
              placeholder="Summarize the core problem before listing its parts."
            />
          </div>

          <section
            className="space-y-4"
            aria-labelledby="challenge-items-heading"
          >
            <RepeaterHeader
              title="Challenge items"
              description={`Each added item requires a title and description. Maximum ${MAX_CHALLENGES}.`}
              count={challengeItems.length}
              max={MAX_CHALLENGES}
              addLabel="Add challenge"
              onAdd={() =>
                setChallengeItems((current) => [
                  ...current,
                  {
                    _key: makeNewKey("challenge"),
                    title: "",
                    desc: "",
                  },
                ])
              }
              disabled={saving}
            />
            <h3 id="challenge-items-heading" className="sr-only">
              Challenge items
            </h3>
            {challengeItems.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                No challenge items added.
              </p>
            ) : (
              <div className="space-y-3">
                {challengeItems.map((item, index) => (
                  <Card key={item._key} size="sm">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm">
                          Challenge {index + 1}
                        </CardTitle>
                        <RemoveRowButton
                          label={`Remove challenge ${index + 1}`}
                          onClick={() =>
                            setChallengeItems((current) =>
                              removeRow(current, index),
                            )
                          }
                          disabled={saving}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`challenge-${index}-title`}>
                          Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`challenge-${index}-title`}
                          required
                          maxLength={160}
                          value={item.title}
                          onChange={(event) =>
                            setChallengeItems((current) =>
                              updateRow(current, index, {
                                title: event.target.value,
                              }),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`challenge-${index}-description`}>
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`challenge-${index}-description`}
                          required
                          rows={3}
                          maxLength={1000}
                          value={item.desc}
                          onChange={(event) =>
                            setChallengeItems((current) =>
                              updateRow(current, index, {
                                desc: event.target.value,
                              }),
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Solution</CardTitle>
          <CardDescription>
            Describe the overall approach and its ordered implementation phases.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          <div className="space-y-2">
            <Label htmlFor="solution-intro">Solution introduction</Label>
            <Textarea
              id="solution-intro"
              rows={5}
              maxLength={2000}
              value={solutionIntro}
              onChange={(event) => setSolutionIntro(event.target.value)}
              placeholder="Summarize the strategy and solution."
            />
          </div>

          <section
            className="space-y-4"
            aria-labelledby="solution-phases-heading"
          >
            <RepeaterHeader
              title="Solution phases"
              description={`Phase name and description are required; timing is optional. Maximum ${MAX_SOLUTION_PHASES}.`}
              count={solutionPhases.length}
              max={MAX_SOLUTION_PHASES}
              addLabel="Add phase"
              onAdd={() =>
                setSolutionPhases((current) => [
                  ...current,
                  {
                    _key: makeNewKey("solution"),
                    phase: "",
                    time: "",
                    desc: "",
                  },
                ])
              }
              disabled={saving}
            />
            <h3 id="solution-phases-heading" className="sr-only">
              Solution phases
            </h3>
            {solutionPhases.length === 0 ? (
              <p className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
                No solution phases added.
              </p>
            ) : (
              <div className="space-y-3">
                {solutionPhases.map((phase, index) => (
                  <Card key={phase._key} size="sm">
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-sm">
                          Phase {index + 1}
                        </CardTitle>
                        <RemoveRowButton
                          label={`Remove phase ${index + 1}`}
                          onClick={() =>
                            setSolutionPhases((current) =>
                              removeRow(current, index),
                            )
                          }
                          disabled={saving}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`solution-phase-${index}-name`}>
                          Phase name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`solution-phase-${index}-name`}
                          required
                          maxLength={160}
                          value={phase.phase}
                          onChange={(event) =>
                            setSolutionPhases((current) =>
                              updateRow(current, index, {
                                phase: event.target.value,
                              }),
                            )
                          }
                          placeholder="Discovery and positioning"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`solution-phase-${index}-time`}>
                          Timing
                        </Label>
                        <Input
                          id={`solution-phase-${index}-time`}
                          maxLength={80}
                          value={phase.time ?? ""}
                          onChange={(event) =>
                            setSolutionPhases((current) =>
                              updateRow(current, index, {
                                time: event.target.value,
                              }),
                            )
                          }
                          placeholder="Weeks 1–2"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`solution-phase-${index}-description`}>
                          Description{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id={`solution-phase-${index}-description`}
                          required
                          rows={3}
                          maxLength={1000}
                          value={phase.desc}
                          onChange={(event) =>
                            setSolutionPhases((current) =>
                              updateRow(current, index, {
                                desc: event.target.value,
                              }),
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Outcome</CardTitle>
          <CardDescription>
            Final narrative and optional outcome film. Video supports YouTube,
            direct URLs, and uploads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="outcome-description">Outcome description</Label>
            <Textarea
              id="outcome-description"
              rows={5}
              maxLength={2000}
              value={outcomeDescription}
              onChange={(event) => setOutcomeDescription(event.target.value)}
              placeholder="Describe the resulting change and business impact."
            />
          </div>

          <VideoInput
            label="Outcome video"
            description="Optional YouTube link, direct video URL, or uploaded file."
            value={outcomeVideo}
            onChange={setOutcomeVideo}
            onUploadingChange={handleUploadingChange}
          />

          <ImageInput
            label="Outcome video thumbnail"
            allowRelative
            description="Optional custom poster. YouTube videos fall back to their generated thumbnail."
            value={outcomeThumbnail}
            onChange={setOutcomeThumbnail}
            onUploadingChange={handleUploadingChange}
            previewAspect="16/9"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Client testimonial</CardTitle>
          <CardDescription>
            Optional proof block. Quote, name, and role are all required once
            any testimonial field is filled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="testimonial-quote">Quote</Label>
            <Textarea
              id="testimonial-quote"
              rows={5}
              maxLength={600}
              value={testimonial.quote}
              onChange={(event) =>
                setTestimonial((current) => ({
                  ...current,
                  quote: event.target.value,
                }))
              }
              placeholder="What did the client say about the engagement?"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Client name</Label>
              <Input
                id="testimonial-name"
                maxLength={120}
                value={testimonial.name}
                onChange={(event) =>
                  setTestimonial((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonial-role">Role</Label>
              <Input
                id="testimonial-role"
                maxLength={160}
                value={testimonial.role}
                onChange={(event) =>
                  setTestimonial((current) => ({
                    ...current,
                    role: event.target.value,
                  }))
                }
                placeholder="Founder, Hudson Hospitality Group"
              />
            </div>
          </div>

          <ImageInput
            label="Testimonial avatar"
            allowRelative
            description="Optional square portrait. Paste a URL or upload a file."
            value={testimonial.avatar_url}
            onChange={(value) =>
              setTestimonial((current) => ({
                ...current,
                avatar_url: value,
              }))
            }
            onUploadingChange={handleUploadingChange}
            previewAspect="1/1"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Publishing</CardTitle>
          <CardDescription>
            Control display order, case-study CTA destination, and visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min={0}
                step={1}
                value={order}
                onChange={(event) => setOrder(Number(event.target.value))}
              />
              <p className="text-muted-foreground text-xs">
                Lower numbers appear first.
              </p>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="calendly_url">Calendly URL</Label>
              <Input
                id="calendly_url"
                type="url"
                maxLength={500}
                placeholder="https://calendly.com/…"
                value={calendlyUrl}
                onChange={(event) => setCalendlyUrl(event.target.value)}
              />
              <p className="text-muted-foreground text-xs">
                Optional case-study sidebar CTA. Leave empty to use no external
                booking URL.
              </p>
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

      <div className="border-border bg-background/95 sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t py-4 backdrop-blur">
        <p className="text-muted-foreground hidden text-xs sm:block">
          {isUploading
            ? "A media upload is still running."
            : "Save only when the case-study content is ready."}
        </p>
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/works")}
            disabled={saving || isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              saving ||
              isUploading ||
              Boolean(industriesError) ||
              !industryId ||
              !industryAvailable
            }
            className="min-w-36"
          >
            {(saving || isUploading) && (
              <Loader2 className="size-4 animate-spin" />
            )}
            {isUploading
              ? "Uploading…"
              : saving
                ? "Saving…"
                : mode === "create"
                  ? "Create work"
                  : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
