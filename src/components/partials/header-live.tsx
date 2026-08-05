import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicBookingSetting } from "@/lib/api/booking-settings";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import { Header } from "./header";

export async function LiveHeader({ className }: { className?: string }) {
  const [settings, industries, booking] = await Promise.all([
    getPublicSiteSetting(),
    getPublicIndustryOptions(),
    getPublicBookingSetting(),
  ]);
  return (
    <Header
      className={className}
      calendlyUrl={settings.calendly_url || undefined}
      industries={industries}
      booking={booking}
    />
  );
}
