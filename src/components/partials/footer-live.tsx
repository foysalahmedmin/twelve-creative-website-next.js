/**
 * Server wrapper for Footer: fetches SiteSetting and feeds dynamic socials
 * + contact email + address into the client `Footer`. Static `SOCIAL_LINKS`
 * + `FOOTER_CONTACT` defaults remain the fallback when SiteSetting is empty
 * or unavailable.
 */

import { Footer, type FooterSocialItem } from "@/components/partials/footer";
import { getPublicSiteSetting } from "@/lib/api/site-setting";

interface Props {
  className?: string;
}

export async function LiveFooter({ className }: Props) {
  const setting = await getPublicSiteSetting();

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
      socials={socials.length ? socials : undefined}
      contactEmail={setting.contact_email || undefined}
      contactAddress={setting.contact_address || undefined}
    />
  );
}
