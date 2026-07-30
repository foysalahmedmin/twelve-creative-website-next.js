import { HeroSection } from "@/components/sections/hero-section";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import { getPublicPageHero } from "@/lib/api/page-heroes";
import { getPublicSiteSetting } from "@/lib/api/site-setting";

export async function LiveHeroSection({
  className,
}: {
  className?: string;
}) {
  const [hero, settings, industries] = await Promise.all([
    getPublicPageHero("home"),
    getPublicSiteSetting(),
    getPublicIndustryOptions(),
  ]);

  const override = hero
    ? {
        title: hero.title ?? "",
        description: hero.description ?? "",
        trust_label: hero.trust_label ?? "",
        primary_cta: hero.primary_cta ?? null,
        secondary_cta: hero.secondary_cta ?? null,
        video: hero.video?.value
          ? {
              src: hero.video.value,
              poster: hero.thumbnail ?? hero.video.poster,
            }
          : hero.thumbnail
            ? { src: "", poster: hero.thumbnail }
            : null,
      }
    : undefined;

  return (
    <HeroSection
      className={className}
      data={override}
      calendlyUrl={settings.calendly_url || undefined}
      industries={industries}
    />
  );
}
