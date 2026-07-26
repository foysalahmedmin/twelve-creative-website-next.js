import { HeroSection } from "@/components/sections/hero-section";
import { getPublicPageHero } from "@/lib/api/page-heroes";

export async function LiveHeroSection({
  className,
}: {
  className?: string;
}) {
  const hero = await getPublicPageHero("home");

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

  return <HeroSection className={className} data={override} />;
}
