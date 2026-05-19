import { apiFetch } from "@/lib/admin/api-client";

export const SITE_SETTING_TAG = "site-setting";

export interface SiteSocials {
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
  facebook?: string;
}

export interface SiteSetting {
  _id?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social?: SiteSocials;
  booking_notification_email?: string;
  updated_at?: string;
}

export async function getPublicSiteSetting(): Promise<SiteSetting> {
  try {
    const res = await apiFetch<SiteSetting>("/api/site-setting/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [SITE_SETTING_TAG],
    });
    return res.data ?? {};
  } catch {
    return {};
  }
}

export async function getAdminSiteSetting(): Promise<SiteSetting> {
  const res = await apiFetch<SiteSetting>("/api/site-setting");
  return res.data ?? {};
}
