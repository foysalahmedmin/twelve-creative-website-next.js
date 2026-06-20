import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { Header } from "./header";

export async function LiveHeader({ className }: { className?: string }) {
  const settings = await getPublicSiteSetting();
  return (
    <Header
      className={className}
      calendlyUrl={settings.calendly_url || undefined}
    />
  );
}
