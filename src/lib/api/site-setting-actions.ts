"use server";

import { revalidatePath, updateTag } from "next/cache";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  SITE_SETTING_TAG,
  type SiteSetting,
  type SiteSocials,
} from "./site-setting";

export interface SiteSettingInput {
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  booking_notification_email?: string;
  social?: SiteSocials;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

export async function updateSiteSettingAction(
  payload: SiteSettingInput,
): Promise<ActionResult<SiteSetting>> {
  try {
    const res = await apiFetch<SiteSetting>("/api/site-setting", {
      method: "PATCH",
      body: payload,
    });
    updateTag(SITE_SETTING_TAG);
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return { ok: true, data: res.data };
  } catch (e) {
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
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Save failed",
    };
  }
}
