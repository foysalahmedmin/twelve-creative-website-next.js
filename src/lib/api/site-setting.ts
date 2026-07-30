import { apiFetch } from "@/lib/admin/api-client";

export const SITE_SETTING_TAG = "site-setting";

export interface SiteSocials {
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
  facebook?: string;
}

export interface FaqSection {
  image?: string;
  image_alt?: string;
  title?: string;
  description?: string;
  name?: string;
  position?: string;
  contact_link?: string;
}

export interface ContentSection {
  title?: string;
  subtitle?: string;
  body?: string;
  image?: string;
}

export interface SectionCopy {
  label?: string;
  title?: string;
  description?: string;
}

export interface ContactPageContent {
  inquiry?: SectionCopy;
  booking?: SectionCopy;
  map?: SectionCopy;
}

export interface FooterContent {
  description?: string;
  cta_text?: string;
  cta_label?: string;
  cta_href?: string;
}

export interface SiteSetting {
  _id?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  contact_whatsapp?: string;
  contact_map_embed_url?: string;
  social?: SiteSocials;
  booking_notification_email?: string;
  faq_section?: FaqSection;
  calendly_url?: string;
  process_thumbnail?: string;
  meeting_scene_image?: string;
  content_section?: ContentSection;
  contact_page?: ContactPageContent;
  footer?: FooterContent;
  updated_at?: string;
}

export interface PublicSiteSettingResult {
  data: SiteSetting;
  failed: boolean;
}

/** Distinguishes an intentionally empty singleton from an unavailable API. */
export async function getPublicSiteSettingResult(): Promise<PublicSiteSettingResult> {
  try {
    const res = await apiFetch<SiteSetting>("/api/site-setting/public", {
      method: "GET",
      auth: false,
      revalidate: 300,
      tags: [SITE_SETTING_TAG],
    });
    return { data: res.data ?? {}, failed: false };
  } catch {
    return { data: {}, failed: true };
  }
}

export async function getPublicSiteSetting(): Promise<SiteSetting> {
  return (await getPublicSiteSettingResult()).data;
}

export async function getAdminSiteSetting(): Promise<SiteSetting> {
  const res = await apiFetch<SiteSetting>("/api/site-setting");
  return res.data ?? {};
}
