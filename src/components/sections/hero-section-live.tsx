import { HeroSection } from "@/components/sections/hero-section";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import {
  getPublicPageHero,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
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

  const videoSrc = resolveVideoSrc(hero?.video);
  const poster = resolveThumbnail(hero?.thumbnail, hero?.video);

  const override = hero
    ? {
        title: hero.title ?? "",
        description: hero.description ?? "",
        trust_label: hero.trust_label ?? "",
        primary_cta: hero.primary_cta ?? null,
        secondary_cta: hero.secondary_cta ?? null,
        video: videoSrc || poster ? { src: videoSrc ?? "", poster } : null,
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
