"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import type {
  TBookingAvailability,
  TBookingContent,
  TBookingQuestions,
} from "@/data/booking.data";
import { BOOKING_SETTING_TAG } from "./booking-settings";

export interface BookingSettingInput {
  content: TBookingContent;
  questions: TBookingQuestions;
  availability: TBookingAvailability;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

function invalidate(): void {
  updateTag(BOOKING_SETTING_TAG);
  revalidatePath("/admin/booking");
  // The modal is mounted in the primary layout, so every page in it can show
  // this copy — revalidate the routes that actually render the section too.
  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/canvus");
}

const trimmed = (value: string, max: number) => value.trim().slice(0, max);

function sanitize(payload: BookingSettingInput): BookingSettingInput {
  return {
    content: {
      label: trimmed(payload.content.label, 60),
      title: trimmed(payload.content.title, 160),
      steps: payload.content.steps
        .map((step) => ({
          title: trimmed(step.title, 80),
          description: trimmed(step.description, 240),
        }))
        .filter((step) => step.title && step.description),
      card_title: trimmed(payload.content.card_title, 120),
      card_description: trimmed(payload.content.card_description, 400),
      benefits: payload.content.benefits
        .map((benefit) => trimmed(benefit, 120))
        .filter(Boolean),
      cta_label: trimmed(payload.content.cta_label, 60),
      footnote: trimmed(payload.content.footnote, 200),
    },
    questions: {
      sector_title: trimmed(payload.questions.sector_title, 160),
      schedule_title: trimmed(payload.questions.schedule_title, 160),
      schedule_subtitle: trimmed(payload.questions.schedule_subtitle, 240),
      details_title: trimmed(payload.questions.details_title, 160),
    },
    availability: {
      slots: payload.availability.slots
        .map((slot) => ({
          label: trimmed(slot.label, 60),
          range: trimmed(slot.range, 80),
          is_active: slot.is_active !== false,
        }))
        .filter((slot) => slot.label && slot.range),
      available_weekdays: [...new Set(payload.availability.available_weekdays)]
        .filter((day) => day >= 0 && day <= 6)
        .sort((a, b) => a - b),
      min_lead_days: payload.availability.min_lead_days,
      max_advance_days: payload.availability.max_advance_days,
    },
  };
}

export async function updateBookingSettingAction(
  payload: BookingSettingInput,
): Promise<ActionResult> {
  try {
    const res = await apiFetch("/api/booking-setting", {
      method: "PATCH",
      body: sanitize(payload),
    });
    invalidate();
    return { ok: true, data: res.data };
  } catch (e) {
    unstable_rethrow(e);
    if (e instanceof ApiError) {
      const sources = e.body?.errorSources;
      if (sources && sources.length) {
        return {
          ok: false,
          error: sources.map((s) => `${s.path}: ${s.message}`).join(" · "),
        };
      }
      return { ok: false, error: e.message };
    }
    return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
  }
}
