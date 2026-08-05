/**
 * Reader for the admin-managed booking setting (section copy, modal questions
 * and availability rules).
 *
 * Everything merges over BOOKING_DATA, so a missing record, a blank field, or
 * an unreachable API all degrade to exactly what the page rendered before this
 * was configurable.
 */

import {
  BOOKING_DATA,
  type TBookingAvailability,
  type TBookingContent,
  type TBookingData,
  type TBookingQuestions,
  type TBookingSlot,
} from "@/data/booking.data";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";

export const BOOKING_SETTING_TAG = "booking-setting";

export interface ApiBookingSetting {
  content?: Partial<TBookingContent>;
  questions?: Partial<TBookingQuestions>;
  availability?: Partial<TBookingAvailability>;
}

/** Blank strings are "not set", not "render an empty heading". */
const text = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback;

const list = <T>(value: T[] | undefined, fallback: T[]) =>
  value && value.length ? value : fallback;

export function mergeBookingSetting(
  api: ApiBookingSetting | null | undefined,
): TBookingData {
  const d = BOOKING_DATA;
  const c = api?.content ?? {};
  const q = api?.questions ?? {};
  const a = api?.availability ?? {};

  const activeSlots = (a.slots ?? []).filter(
    (slot): slot is TBookingSlot => slot.is_active !== false,
  );

  return {
    content: {
      label: text(c.label, d.content.label),
      title: text(c.title, d.content.title),
      steps: list(c.steps, d.content.steps),
      card_title: text(c.card_title, d.content.card_title),
      card_description: text(c.card_description, d.content.card_description),
      benefits: list(c.benefits, d.content.benefits),
      cta_label: text(c.cta_label, d.content.cta_label),
      footnote: text(c.footnote, d.content.footnote),
    },
    questions: {
      sector_title: text(q.sector_title, d.questions.sector_title),
      schedule_title: text(q.schedule_title, d.questions.schedule_title),
      schedule_subtitle: text(
        q.schedule_subtitle,
        d.questions.schedule_subtitle,
      ),
      details_title: text(q.details_title, d.questions.details_title),
    },
    availability: {
      // Deactivating every slot would leave the step with nothing to pick, so
      // fall back rather than dead-end the visitor mid-booking.
      slots: activeSlots.length ? activeSlots : d.availability.slots,
      available_weekdays: list(
        a.available_weekdays,
        d.availability.available_weekdays,
      ),
      min_lead_days: a.min_lead_days ?? d.availability.min_lead_days,
      max_advance_days: a.max_advance_days ?? d.availability.max_advance_days,
    },
  };
}

export async function getPublicBookingSetting(): Promise<TBookingData> {
  try {
    const res = await apiFetch<ApiBookingSetting | null>(
      "/api/booking-setting/public",
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [BOOKING_SETTING_TAG],
      },
    );
    return mergeBookingSetting(res.data);
  } catch {
    return BOOKING_DATA;
  }
}

export async function getAdminBookingSetting(): Promise<TBookingData> {
  try {
    const res = await apiFetch<ApiBookingSetting | null>(
      "/api/booking-setting",
      { method: "GET" },
    );
    return mergeBookingSetting(res.data);
  } catch (error) {
    unstable_rethrow(error);
    // An install that was never seeded 404s here, and a transient API failure
    // would otherwise blank the whole screen. Showing the defaults keeps the
    // form usable — saving upserts the record either way.
    if (error instanceof ApiError) return BOOKING_DATA;
    throw error;
  }
}
