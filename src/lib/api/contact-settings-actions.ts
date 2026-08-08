"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  LOCKED_CONTACT_FIELD_KEYS,
  type TContactFormData,
} from "@/data/contact-form.data";
import { CONTACT_SETTING_TAG } from "./contact-settings";

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

function invalidate(): void {
  updateTag(CONTACT_SETTING_TAG);
  revalidatePath("/admin/contact-form");
  revalidatePath("/contact");
  revalidatePath("/canvus");
}

const trimmed = (value: string, max: number) => value.trim().slice(0, max);

function sanitize(payload: TContactFormData): TContactFormData {
  const option = (o: { label: string; value: string; is_active?: boolean }) => ({
    label: trimmed(o.label, 80),
    value: trimmed(o.value, 60),
    is_active: o.is_active !== false,
  });

  return {
    content: {
      submit_label: trimmed(payload.content.submit_label, 60),
      submitting_label: trimmed(payload.content.submitting_label, 60),
      industry_placeholder: trimmed(payload.content.industry_placeholder, 80),
      industry_other_label: trimmed(payload.content.industry_other_label, 80),
      timeline_placeholder: trimmed(payload.content.timeline_placeholder, 80),
      budget_placeholder: trimmed(payload.content.budget_placeholder, 80),
    },
    fields: payload.fields.map((field) => {
      const locked = LOCKED_CONTACT_FIELD_KEYS.includes(field.key);
      return {
        key: field.key,
        label: trimmed(field.label, 120),
        placeholder: trimmed(field.placeholder ?? "", 160),
        // Re-asserted here as well as in the UI and on the server: name and
        // email must never be switched off, or the form starts producing
        // submissions the API rejects.
        is_visible: locked ? true : field.is_visible,
        is_required: locked ? true : field.is_required,
      };
    }),
    timeline_options: payload.timeline_options
      .map(option)
      .filter((o) => o.label && o.value),
    budget_options: payload.budget_options
      .map(option)
      .filter((o) => o.label && o.value),
  };
}

export async function updateContactSettingAction(
  payload: TContactFormData,
): Promise<ActionResult> {
  try {
    const res = await apiFetch("/api/contact-setting", {
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
