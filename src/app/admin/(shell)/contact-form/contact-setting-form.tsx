"use client";

import { Loader2, Lock, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  LOCKED_CONTACT_FIELD_KEYS,
  type TContactFormData,
  type TContactOption,
} from "@/data/contact-form.data";
import { updateContactSettingAction } from "@/lib/api/contact-settings-actions";

interface Props {
  initial: TContactFormData;
}

const SectionHeading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-1">
    <h3 className="text-foreground text-sm font-semibold">{title}</h3>
    <p className="text-muted-foreground text-xs">{description}</p>
  </div>
);

/** Timeline and Budget share an editor — same shape, same rules. */
function OptionEditor({
  title,
  description,
  options,
  onChange,
}: {
  title: string;
  description: string;
  options: TContactOption[];
  onChange: (next: TContactOption[]) => void;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <SectionHeading title={title} description={description} />
        {options.map((option, i) => (
          <div
            key={i}
            className="border-border grid grid-cols-1 items-center gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
          >
            <Input
              aria-label={`${title} option ${i + 1} label`}
              placeholder="Shown to the visitor"
              value={option.label}
              onChange={(e) =>
                onChange(
                  options.map((o, idx) =>
                    idx === i ? { ...o, label: e.target.value } : o,
                  ),
                )
              }
            />
            <Input
              aria-label={`${title} option ${i + 1} value`}
              placeholder="stored-value"
              value={option.value}
              onChange={(e) =>
                onChange(
                  options.map((o, idx) =>
                    idx === i ? { ...o, value: e.target.value } : o,
                  ),
                )
              }
            />
            <Switch
              aria-label={`${title} option ${i + 1} active`}
              checked={option.is_active !== false}
              onCheckedChange={(checked) =>
                onChange(
                  options.map((o, idx) =>
                    idx === i ? { ...o, is_active: checked } : o,
                  ),
                )
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${title} option ${i + 1}`}
              onClick={() => onChange(options.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        ))}
        <p className="text-muted-foreground text-xs">
          The label is what the visitor sees and what appears on the enquiry.
          Leave the stored value alone on existing entries so older enquiries
          stay readable.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            onChange([...options, { label: "", value: "", is_active: true }])
          }
        >
          <Plus className="size-4" /> Add option
        </Button>
      </CardContent>
    </Card>
  );
}

export function ContactSettingForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TContactFormData>(() =>
    structuredClone(initial),
  );

  const setContent = <K extends keyof TContactFormData["content"]>(
    key: K,
    value: TContactFormData["content"][K],
  ) => setForm((s) => ({ ...s, content: { ...s.content, [key]: value } }));

  const setField = (
    index: number,
    patch: Partial<TContactFormData["fields"][number]>,
  ) =>
    setForm((s) => ({
      ...s,
      fields: s.fields.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.fields.some((f) => !f.label.trim())) {
      toast.error("Every field needs a label");
      return;
    }
    for (const [name, opts] of [
      ["Timeline", form.timeline_options],
      ["Budget", form.budget_options],
    ] as const) {
      if (!opts.some((o) => o.is_active !== false)) {
        toast.error(`Keep at least one ${name} option active`);
        return;
      }
      if (opts.some((o) => !o.label.trim() || !o.value.trim())) {
        toast.error(`Every ${name} option needs a label and a value`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await updateContactSettingAction(form);
      if (!res.ok) {
        toast.error(res.error ?? "Save failed");
        return;
      }
      toast.success("Contact form saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Fields ── */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <SectionHeading
            title="Fields"
            description="Rename a field, change its placeholder, hide it, or make it required."
          />
          {form.fields.map((field, i) => {
            const locked = LOCKED_CONTACT_FIELD_KEYS.includes(field.key);
            return (
              <div
                key={field.key}
                className="border-border space-y-3 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground inline-flex items-center gap-1.5 font-mono text-xs">
                    {field.key}
                    {locked && <Lock className="size-3" />}
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Visible</span>
                      <Switch
                        aria-label={`${field.key} visible`}
                        checked={field.is_visible}
                        disabled={locked}
                        onCheckedChange={(v) =>
                          setField(i, { is_visible: v })
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Required</span>
                      <Switch
                        aria-label={`${field.key} required`}
                        checked={field.is_required}
                        disabled={locked}
                        onCheckedChange={(v) =>
                          setField(i, { is_required: v })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    aria-label={`${field.key} label`}
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => setField(i, { label: e.target.value })}
                  />
                  <Input
                    aria-label={`${field.key} placeholder`}
                    placeholder="Placeholder"
                    value={field.placeholder}
                    onChange={(e) =>
                      setField(i, { placeholder: e.target.value })
                    }
                  />
                </div>
              </div>
            );
          })}
          <p className="text-muted-foreground text-xs">
            Name and email are locked on: an enquiry cannot be saved without
            them, so hiding either would stop the form working.
          </p>
        </CardContent>
      </Card>

      <OptionEditor
        title="Timeline options"
        description="The choices in the Timeline dropdown."
        options={form.timeline_options}
        onChange={(next) => setForm((s) => ({ ...s, timeline_options: next }))}
      />

      <OptionEditor
        title="Budget options"
        description="The choices in the Monthly Budget Range dropdown."
        options={form.budget_options}
        onChange={(next) => setForm((s) => ({ ...s, budget_options: next }))}
      />

      {/* ── Buttons & placeholders ── */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <SectionHeading
            title="Buttons & dropdown prompts"
            description="The submit button and the first, unselected entry in each dropdown."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(
              [
                ["submit_label", "Submit button"],
                ["submitting_label", "While submitting"],
                ["industry_placeholder", "Industry prompt"],
                ["industry_other_label", 'Industry "other" label'],
                ["timeline_placeholder", "Timeline prompt"],
                ["budget_placeholder", "Budget prompt"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form.content[key]}
                  onChange={(e) => setContent(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-1 size-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
