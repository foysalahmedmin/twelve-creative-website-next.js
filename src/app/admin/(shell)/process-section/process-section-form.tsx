"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ImageInput } from "@/components/admin/inputs/image-input";
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
import { Textarea } from "@/components/ui/textarea";
import { PROCESS_ICON_KEYS, type TProcessIconKey } from "@/data/process.data";
import type { ApiProcessSection } from "@/lib/api/process-section";
import {
  updateProcessSectionAction,
  type ProcessSectionInput,
} from "@/lib/api/process-section-actions";

const MAX_PROCESS_STEPS = 12;

const ICON_LABELS: Record<TProcessIconKey, string> = {
  understand: "Understand (Search)",
  position: "Position (Compass)",
  build: "Build (Brush)",
  launch: "Launch (Rocket)",
  install: "Install (Connect)",
  improve: "Improve (Refresh)",
};

type EditableStep = ProcessSectionInput["process_steps"][number];

interface ProcessSectionFormProps {
  initial: ApiProcessSection;
}

function toEditableSteps(initial: ApiProcessSection): EditableStep[] {
  return initial.process_steps.map((step) => ({
    id: step.id,
    icon: step.icon,
    title: step.title,
    description: step.description,
    image: step.image,
  }));
}

function nextStepIcon(position: number): TProcessIconKey {
  return PROCESS_ICON_KEYS[position % PROCESS_ICON_KEYS.length];
}

export function ProcessSectionForm({ initial }: ProcessSectionFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const [label, setLabel] = useState(initial.label);
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [thumbnail, setThumbnail] = useState(initial.thumbnail);
  const [steps, setSteps] = useState<EditableStep[]>(() =>
    toEditableSteps(initial),
  );
  const isUploading = activeUploads > 0;

  const handleUploadingChange = (uploading: boolean) => {
    setActiveUploads((current) => Math.max(0, current + (uploading ? 1 : -1)));
  };

  const updateStep = <Key extends keyof EditableStep>(
    stepId: string,
    key: Key,
    value: EditableStep[Key],
  ) => {
    setSteps((current) =>
      current.map((step) =>
        step.id === stepId ? { ...step, [key]: value } : step,
      ),
    );
  };

  const addStep = () => {
    setSteps((current) => {
      if (current.length >= MAX_PROCESS_STEPS) return current;
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          icon: nextStepIcon(current.length),
          title: "",
          description: "",
          image: "",
        },
      ];
    });
  };

  const removeStep = (stepId: string) => {
    setSteps((current) => {
      if (current.length <= 1) return current;
      return current.filter((step) => step.id !== stepId);
    });
  };

  const moveStep = (position: number, direction: -1 | 1) => {
    setSteps((current) => {
      const destination = position + direction;
      if (destination < 0 || destination >= current.length) return current;
      const reordered = [...current];
      [reordered[position], reordered[destination]] = [
        reordered[destination],
        reordered[position],
      ];
      return reordered;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploading) {
      toast.error("Wait for every image upload to finish before saving");
      return;
    }

    const cleanLabel = label.trim();
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanThumbnail = thumbnail.trim();
    if (!cleanLabel || !cleanTitle || !cleanDescription || !cleanThumbnail) {
      toast.error("Label, title, description, and thumbnail are required");
      return;
    }
    if (steps.length < 1 || steps.length > MAX_PROCESS_STEPS) {
      toast.error(`Add between 1 and ${MAX_PROCESS_STEPS} process steps`);
      return;
    }

    const cleanedSteps = steps.map((step) => ({
      id: step.id.trim(),
      icon: step.icon,
      title: step.title.trim(),
      description: step.description.trim(),
      image: step.image.trim(),
    }));
    const invalidPosition = cleanedSteps.findIndex(
      (step) =>
        !step.id ||
        !step.title ||
        !step.description ||
        !step.image ||
        !step.icon,
    );
    if (invalidPosition !== -1) {
      toast.error(
        `Step ${invalidPosition + 1} needs a title, description, icon, and image`,
      );
      return;
    }
    if (
      new Set(cleanedSteps.map((step) => step.id)).size !== cleanedSteps.length
    ) {
      toast.error("Each process step must have a unique ID");
      return;
    }

    setSaving(true);
    const result = await updateProcessSectionAction({
      label: cleanLabel,
      title: cleanTitle,
      description: cleanDescription,
      thumbnail: cleanThumbnail,
      process_steps: cleanedSteps,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error ?? "Save failed");
      return;
    }

    toast.success("Process section updated");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Section content</CardTitle>
          <CardDescription>
            Copy is shared across every Process section. The main portrait is
            used on the primary desktop placements; mobile and industry pages
            use the step images below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="process-label">
                Eyebrow label <span className="text-destructive">*</span>
              </Label>
              <Input
                id="process-label"
                required
                maxLength={80}
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Our Process"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="process-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="process-title"
                required
                maxLength={300}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="A clear path from understanding to execution."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="process-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="process-description"
                required
                maxLength={800}
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain how the process creates value for the client."
              />
            </div>
          </div>

          <ImageInput
            label="Main process image"
            description="Used in the sticky media column on the main Process placements. Portrait 4:5 works best. Paste a URL or upload a file."
            required
            allowRelative
            value={thumbnail}
            onChange={setThumbnail}
            onUploadingChange={handleUploadingChange}
            previewAspect="4/5"
          />
        </CardContent>
      </Card>

      <section aria-labelledby="process-steps-heading" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="process-steps-heading"
              className="font-heading text-foreground text-lg font-bold tracking-tight"
            >
              Process steps
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              The displayed step number follows this order automatically. Add up
              to {MAX_PROCESS_STEPS} steps.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addStep}
            disabled={saving || steps.length >= MAX_PROCESS_STEPS}
            className="shrink-0"
          >
            <Plus className="size-4" />
            Add step
          </Button>
        </div>

        <p className="sr-only" aria-live="polite">
          {steps.length} of {MAX_PROCESS_STEPS} process steps
        </p>

        <div className="space-y-4">
          {steps.map((step, position) => (
            <Card key={step.id} size="sm">
              <CardHeader className="border-b">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold">
                      {String(position + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {step.title.trim() || `Step ${position + 1}`}
                      </CardTitle>
                      <CardDescription>
                        Position {position + 1} of {steps.length}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveStep(position, -1)}
                      disabled={saving || position === 0}
                      aria-label={`Move step ${position + 1} up`}
                      title="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveStep(position, 1)}
                      disabled={saving || position === steps.length - 1}
                      aria-label={`Move step ${position + 1} down`}
                      title="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeStep(step.id)}
                      disabled={saving || steps.length === 1}
                      aria-label={`Remove step ${position + 1}`}
                      title={
                        steps.length === 1
                          ? "At least one step is required"
                          : "Remove step"
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`process-step-${position}-title`}>
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={`process-step-${position}-title`}
                      required
                      maxLength={160}
                      value={step.title}
                      onChange={(event) =>
                        updateStep(step.id, "title", event.target.value)
                      }
                      placeholder="Understand the business"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`process-step-${position}-icon`}>
                      Icon <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={step.icon}
                      onValueChange={(value) =>
                        updateStep(step.id, "icon", value as TProcessIconKey)
                      }
                    >
                      <SelectTrigger id={`process-step-${position}-icon`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROCESS_ICON_KEYS.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {ICON_LABELS[icon]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`process-step-${position}-description`}>
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id={`process-step-${position}-description`}
                      required
                      maxLength={600}
                      rows={3}
                      value={step.description}
                      onChange={(event) =>
                        updateStep(step.id, "description", event.target.value)
                      }
                      placeholder="Describe what happens during this step."
                    />
                  </div>
                </div>

                <ImageInput
                  label={`Step ${position + 1} image`}
                  description="Shown when this step becomes active. Paste a URL or upload a portrait image."
                  required
                  allowRelative
                  value={step.image}
                  onChange={(value) => updateStep(step.id, "image", value)}
                  onUploadingChange={handleUploadingChange}
                  previewAspect="4/5"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="border-border bg-background/95 sticky bottom-0 z-10 flex items-center justify-between gap-4 border-t py-4 backdrop-blur">
        <p className="text-muted-foreground hidden text-xs sm:block">
          Saving publishes these changes to every Process section.
        </p>
        <Button
          type="submit"
          disabled={saving || isUploading}
          className="ml-auto min-w-36"
        >
          {(saving || isUploading) && (
            <Loader2 className="size-4 animate-spin" />
          )}
          {isUploading ? "Uploading…" : saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
