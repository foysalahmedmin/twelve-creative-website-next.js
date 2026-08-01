"use server";

import { revalidatePath, updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { apiFetch } from "@/lib/admin/api-client";
import { ApiError } from "@/lib/admin/types";
import {
  SITE_SETTING_TAG,
  type ContentSection,
  type ContactPageContent,
  type FaqSection,
  type FooterContent,
  type SiteSetting,
  type SiteSocials,
} from "./site-setting";

export interface SiteSettingInput {
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_whatsapp?: string;
  contact_map_embed_url?: string;
  booking_notification_email?: string;
  social?: SiteSocials;
  faq_section?: FaqSection;
  calendly_url?: string;
  process_thumbnail?: string;
  meeting_scene_image?: string;
  content_section?: ContentSection;
  contact_page?: ContactPageContent;
  footer?: FooterContent;
}

export interface ActionResult<T = unknown> {
  ok: boolean;
  error?: string;
  data?: T;
}

/**
 * Sends a real notification email to whoever is configured right now, so an
 * admin can confirm the address receives mail instead of finding out when a
 * lead goes missing. Targets the saved value — save first, then test.
 */
export async function sendTestNotificationEmailAction(): Promise<
  ActionResult<{ recipients: string[] }>
> {
  try {
    const res = await apiFetch<{ recipients: string[] }>(
      "/api/site-setting/notification-email/test",
      { method: "POST" },
    );
    return { ok: true, data: res.data };
  } catch (e) {
    unstable_rethrow(e);
    if (e instanceof ApiError) {
      return { ok: false, error: e.message };
    }
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not send the test email",
    };
  }
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
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Save failed",
    };
  }
}
