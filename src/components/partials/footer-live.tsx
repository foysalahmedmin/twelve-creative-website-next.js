/**
 * Server wrapper for Footer: fetches SiteSetting and Industry content. Static
 * defaults are used only when the corresponding API is unavailable; a valid
 * empty CMS response remains empty.
 */

import { Footer, type FooterSocialItem } from "@/components/partials/footer";
import { getPublicIndustriesResult } from "@/lib/api/industries";
import { getPublicSiteSettingResult } from "@/lib/api/site-setting";

interface Props {
  className?: string;
}

export async function LiveFooter({ className }: Props) {
  const [settingResult, industriesResult] = await Promise.all([
    getPublicSiteSettingResult(),
    getPublicIndustriesResult(),
  ]);
  const setting = settingResult.data;

  const socials: FooterSocialItem[] = [];
  if (setting.social?.facebook)
    socials.push({ platform: "facebook", href: setting.social.facebook });
  if (setting.social?.x)
    socials.push({ platform: "twitter", href: setting.social.x });
  if (setting.social?.linkedin)
    socials.push({ platform: "linkedin", href: setting.social.linkedin });
  if (setting.social?.instagram)
    socials.push({ platform: "instagram", href: setting.social.instagram });
  if (setting.social?.youtube)
    socials.push({ platform: "youtube", href: setting.social.youtube });

  return (
    <Footer
      className={className}
      socials={settingResult.failed ? undefined : socials}
      contactEmail={setting.contact_email || undefined}
      contactPhone={
        settingResult.failed ? undefined : setting.contact_phone?.trim() || null
      }
      contactAddress={setting.contact_address || undefined}
      industries={
        industriesResult.failed
          ? undefined
          : industriesResult.data.map((industry) => ({
              label: industry.name,
              href: `/industries/${industry.slug}`,
            }))
      }
      description={setting.footer?.description || undefined}
      ctaText={setting.footer?.cta_text || undefined}
      ctaLabel={setting.footer?.cta_label || undefined}
      ctaHref={setting.footer?.cta_href || undefined}
    />
  );
}
