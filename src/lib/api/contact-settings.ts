/**
 * Reader for the admin-managed inquiry form setting.
 *
 * Everything merges over CONTACT_FORM_DATA, so a missing record, a blank
 * field, or an unreachable API all degrade to exactly what the form rendered
 * before any of this was configurable.
 */

import { unstable_rethrow } from "next/navigation";
import {
  CONTACT_FORM_DATA,
  CONTACT_FIELD_KEYS,
  LOCKED_CONTACT_FIELD_KEYS,
  type TContactField,
  type TContactFormContent,
  type TContactFormData,
  type TContactOption,
} from "@/data/contact-form.data";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";

export const CONTACT_SETTING_TAG = "contact-setting";

export interface ApiContactSetting {
  content?: Partial<TContactFormContent>;
  fields?: TContactField[];
  timeline_options?: TContactOption[];
  budget_options?: TContactOption[];
}

const text = (value: string | undefined, fallback: string) =>
  value && value.trim() ? value : fallback;

/** Keeps only entries that are still switched on, falling back if none are. */
const activeOptions = (
  supplied: TContactOption[] | undefined,
  fallback: TContactOption[],
) => {
  const active = (supplied ?? []).filter((o) => o.is_active !== false);
  return active.length ? active : fallback;
};

export function mergeContactSetting(
  api: ApiContactSetting | null | undefined,
): TContactFormData {
  const d = CONTACT_FORM_DATA;
  const c = api?.content ?? {};

  // Rebuilt from the canonical key list rather than trusting the stored order,
  // so the form keeps its designed layout and a key that was never saved still
  // renders from defaults.
  const fields = CONTACT_FIELD_KEYS.map((key) => {
    const fallback = d.fields.find((f) => f.key === key)!;
    const saved = api?.fields?.find((f) => f.key === key);
    if (!saved) return fallback;

    const locked = LOCKED_CONTACT_FIELD_KEYS.includes(key);
    return {
      key,
      label: text(saved.label, fallback.label),
      placeholder: saved.placeholder ?? fallback.placeholder,
      // Name and email stay on no matter what the record says — the API
      // rejects a submission without them, so hiding one would silently
      // break the whole form.
      is_visible: locked ? true : (saved.is_visible ?? fallback.is_visible),
      is_required: locked ? true : (saved.is_required ?? fallback.is_required),
    };
  });

  return {
    content: {
      submit_label: text(c.submit_label, d.content.submit_label),
      submitting_label: text(c.submitting_label, d.content.submitting_label),
      industry_placeholder: text(
        c.industry_placeholder,
        d.content.industry_placeholder,
      ),
      industry_other_label: text(
        c.industry_other_label,
        d.content.industry_other_label,
      ),
      timeline_placeholder: text(
        c.timeline_placeholder,
        d.content.timeline_placeholder,
      ),
      budget_placeholder: text(
        c.budget_placeholder,
        d.content.budget_placeholder,
      ),
    },
    fields,
    timeline_options: activeOptions(api?.timeline_options, d.timeline_options),
    budget_options: activeOptions(api?.budget_options, d.budget_options),
  };
}

export async function getPublicContactSetting(): Promise<TContactFormData> {
  try {
    const res = await apiFetch<ApiContactSetting | null>(
      "/api/contact-setting/public",
      {
        method: "GET",
        auth: false,
        revalidate: 60,
        tags: [CONTACT_SETTING_TAG],
      },
    );
    return mergeContactSetting(res.data);
  } catch {
    return CONTACT_FORM_DATA;
  }
}

export async function getAdminContactSetting(): Promise<TContactFormData> {
  try {
    const res = await apiFetch<ApiContactSetting | null>(
      "/api/contact-setting",
      { method: "GET" },
    );
    return mergeContactSetting(res.data);
  } catch (error) {
    unstable_rethrow(error);
    // An unseeded install 404s here, and a transient failure would otherwise
    // blank the screen. Showing defaults keeps the form usable — saving
    // upserts the record either way.
    if (error instanceof ApiError) return CONTACT_FORM_DATA;
    throw error;
  }
}
