import { HeroSection } from "@/components/sections/hero-section";
import type { THomeHero } from "@/data/home-hero.data";
import { getPublicPageHero } from "@/lib/api/page-heroes";

export async function LiveHeroSection({
  className,
}: {
  className?: string;
}) {
  const hero = await getPublicPageHero("home");

  const override: Partial<THomeHero> | undefined = hero
    ? {
        ...(hero.title ? { title: hero.title } : {}),
        ...(hero.description ? { description: hero.description } : {}),
        ...(hero.trust_label ? { trust_label: hero.trust_label } : {}),
        ...(hero.primary_cta ? { primary_cta: hero.primary_cta } : {}),
        ...(hero.secondary_cta ? { secondary_cta: hero.secondary_cta } : {}),
        ...(hero.video?.value
          ? { video: { src: hero.video.value, poster: hero.video.poster } }
          : {}),
      }
    : undefined;

  return <HeroSection className={className} data={override} />;
}
