"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { WEEKDAY_LABELS, type TBookingData } from "@/data/booking.data";
import { updateBookingSettingAction } from "@/lib/api/booking-settings-actions";
import { cn } from "@/lib/utils";

interface Props {
  initial: TBookingData;
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

export function BookingSettingForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TBookingData>(() =>
    structuredClone(initial),
  );

  const setContent = <K extends keyof TBookingData["content"]>(
    key: K,
    value: TBookingData["content"][K],
  ) => setForm((f) => ({ ...f, content: { ...f.content, [key]: value } }));

  const setQuestion = (key: keyof TBookingData["questions"], value: string) =>
    setForm((f) => ({ ...f, questions: { ...f.questions, [key]: value } }));

  const setAvailability = <K extends keyof TBookingData["availability"]>(
    key: K,
    value: TBookingData["availability"][K],
  ) =>
    setForm((f) => ({ ...f, availability: { ...f.availability, [key]: value } }));

  const toggleWeekday = (day: number) =>
    setAvailability(
      "available_weekdays",
      form.availability.available_weekdays.includes(day)
        ? form.availability.available_weekdays.filter((d) => d !== day)
        : [...form.availability.available_weekdays, day].sort((a, b) => a - b),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.availability.available_weekdays.length) {
      toast.error("Pick at least one day calls can be booked on");
      return;
    }
    if (!form.availability.slots.some((s) => s.is_active !== false)) {
      toast.error("Keep at least one time slot active");
      return;
    }
    if (form.availability.min_lead_days >= form.availability.max_advance_days) {
      toast.error("The earliest bookable day must fall inside the window");
      return;
    }

    setSaving(true);
    try {
      const res = await updateBookingSettingAction(form);
      if (!res.ok) {
        toast.error(res.error ?? "Save failed");
        return;
      }
      toast.success("Booking settings saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Section copy ── */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <SectionHeading
            title="Section copy"
            description="The panel shown on the contact page above the booking button."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="label">Badge</Label>
              <Input
                id="label"
                value={form.content.label}
                onChange={(e) => setContent("label", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_label">Button label</Label>
              <Input
                id="cta_label"
                value={form.content.cta_label}
                onChange={(e) => setContent("cta_label", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Heading</Label>
            <Input
              id="title"
              value={form.content.title}
              onChange={(e) => setContent("title", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="card_title">Card heading</Label>
              <Input
                id="card_title"
                value={form.content.card_title}
                onChange={(e) => setContent("card_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footnote">Footnote</Label>
              <Input
                id="footnote"
                value={form.content.footnote}
                onChange={(e) => setContent("footnote", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card_description">Card description</Label>
            <Textarea
              id="card_description"
              rows={3}
              value={form.content.card_description}
              onChange={(e) => setContent("card_description", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Steps ── */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <SectionHeading
            title="Steps"
            description="The numbered cards listed beside the booking panel. Icons are assigned automatically in order."
          />
          {form.content.steps.map((step, i) => (
            <div
              key={i}
              className="border-border grid grid-cols-1 gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_2fr_auto]"
            >
              <Input
                aria-label={`Step ${i + 1} title`}
                placeholder="Title"
                value={step.title}
                onChange={(e) =>
                  setContent(
                    "steps",
                    form.content.steps.map((s, idx) =>
                      idx === i ? { ...s, title: e.target.value } : s,
                    ),
                  )
                }
              />
              <Input
                aria-label={`Step ${i + 1} description`}
                placeholder="Description"
                value={step.description}
                onChange={(e) =>
                  setContent(
                    "steps",
                    form.content.steps.map((s, idx) =>
                      idx === i ? { ...s, description: e.target.value } : s,
                    ),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove step ${i + 1}`}
                onClick={() =>
                  setContent(
                    "steps",
                    form.content.steps.filter((_, idx) => idx !== i),
                  )
                }
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              setContent("steps", [
                ...form.content.steps,
                { title: "", description: "" },
              ])
            }
          >
            <Plus className="size-4" /> Add step
          </Button>
        </CardContent>
      </Card>

      {/* ── Benefits ── */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <SectionHeading
            title="Benefits"
            description="The ticked list inside the orange panel."
          />
          {form.content.benefits.map((benefit, i) => (
            <div key={i} className="flex gap-2">
              <Input
                aria-label={`Benefit ${i + 1}`}
                value={benefit}
                onChange={(e) =>
                  setContent(
                    "benefits",
                    form.content.benefits.map((b, idx) =>
                      idx === i ? e.target.value : b,
                    ),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove benefit ${i + 1}`}
                onClick={() =>
                  setContent(
                    "benefits",
                    form.content.benefits.filter((_, idx) => idx !== i),
                  )
                }
              >
                <Trash2 className="text-destructive size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              setContent("benefits", [...form.content.benefits, ""])
            }
          >
            <Plus className="size-4" /> Add benefit
          </Button>
        </CardContent>
      </Card>

      {/* ── Modal questions ── */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <SectionHeading
            title="Booking modal questions"
            description="The heading shown at the top of each step inside the booking modal."
          />
          <div className="space-y-2">
            <Label htmlFor="sector_title">Step 1 — sector</Label>
            <Input
              id="sector_title"
              value={form.questions.sector_title}
              onChange={(e) => setQuestion("sector_title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="schedule_title">Step 2 — date &amp; time</Label>
            <Input
              id="schedule_title"
              value={form.questions.schedule_title}
              onChange={(e) => setQuestion("schedule_title", e.target.value)}
            />
            <Input
              aria-label="Step 2 supporting line"
              placeholder="Supporting line"
              value={form.questions.schedule_subtitle}
              onChange={(e) => setQuestion("schedule_subtitle", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details_title">Step 3 — contact details</Label>
            <Input
              id="details_title"
              value={form.questions.details_title}
              onChange={(e) => setQuestion("details_title", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Availability ── */}
      <Card>
        <CardContent className="space-y-5 pt-6">
          <SectionHeading
            title="Availability"
            description="Controls which dates and slots a visitor can pick. Turning a slot off hides it without deleting it."
          />

          <div className="space-y-2">
            <Label>Days calls can be booked</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_LABELS.map((day, index) => {
                const active =
                  form.availability.available_weekdays.includes(index);
                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleWeekday(index)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
            <p className="text-muted-foreground text-xs">
              A visitor who picks a day that is switched off is told to choose
              another date.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="min_lead_days">Earliest booking (days away)</Label>
              <Input
                id="min_lead_days"
                type="number"
                min={0}
                max={90}
                value={form.availability.min_lead_days}
                onChange={(e) =>
                  setAvailability("min_lead_days", Number(e.target.value))
                }
              />
              <p className="text-muted-foreground text-xs">
                0 allows same-day bookings.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_advance_days">Booking window (days)</Label>
              <Input
                id="max_advance_days"
                type="number"
                min={1}
                max={365}
                value={form.availability.max_advance_days}
                onChange={(e) =>
                  setAvailability("max_advance_days", Number(e.target.value))
                }
              />
              <p className="text-muted-foreground text-xs">
                How far ahead the calendar stays open.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Time slots</Label>
            {form.availability.slots.map((slot, i) => (
              <div
                key={i}
                className="border-border grid grid-cols-1 items-center gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
              >
                <Input
                  aria-label={`Slot ${i + 1} label`}
                  placeholder="Morning"
                  value={slot.label}
                  onChange={(e) =>
                    setAvailability(
                      "slots",
                      form.availability.slots.map((s, idx) =>
                        idx === i ? { ...s, label: e.target.value } : s,
                      ),
                    )
                  }
                />
                <Input
                  aria-label={`Slot ${i + 1} time range`}
                  placeholder="9:00 AM – 12:00 PM"
                  value={slot.range}
                  onChange={(e) =>
                    setAvailability(
                      "slots",
                      form.availability.slots.map((s, idx) =>
                        idx === i ? { ...s, range: e.target.value } : s,
                      ),
                    )
                  }
                />
                <Switch
                  aria-label={`Slot ${i + 1} active`}
                  checked={slot.is_active !== false}
                  onCheckedChange={(checked) =>
                    setAvailability(
                      "slots",
                      form.availability.slots.map((s, idx) =>
                        idx === i ? { ...s, is_active: checked } : s,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove slot ${i + 1}`}
                  onClick={() =>
                    setAvailability(
                      "slots",
                      form.availability.slots.filter((_, idx) => idx !== i),
                    )
                  }
                >
                  <Trash2 className="text-destructive size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                setAvailability("slots", [
                  ...form.availability.slots,
                  { label: "", range: "", is_active: true },
                ])
              }
            >
              <Plus className="size-4" /> Add slot
            </Button>
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
