import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import { Header } from "./header";

export async function LiveHeader({ className }: { className?: string }) {
  const [settings, industries] = await Promise.all([
    getPublicSiteSetting(),
    getPublicIndustryOptions(),
  ]);
  return (
    <Header
      className={className}
      calendlyUrl={settings.calendly_url || undefined}
      industries={industries}
    />
  );
}
