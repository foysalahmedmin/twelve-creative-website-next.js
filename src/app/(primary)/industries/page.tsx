import { CTAV1Section } from "@/components/sections/cta-v1-section";
import { HeroV1Section } from "@/components/sections/hero-v1-section";
import { IndustriesDetailSection } from "@/components/sections/industries-detail-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { INDUSTRIES_DATA } from "@/data/industries.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicIndustriesAsLegacyResult } from "@/lib/api/industries";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicSharedSection } from "@/lib/api/shared-sections";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("industries");
  return resolvePageMetadata(hero, {
    title:
      "Industries | Hospitality, Real Estate, Ventures & Professional Services",
    description:
      "Twelve Creative works with hospitality, real estate, ventures, and professional service businesses that need stronger marketing structure.",
  });
}

export default async function IndustriesPage() {
  const [testimonialsData, liveIndustries, hero, cta, testimonialsHeading] =
    await Promise.all([
      getPublicTestimonialsForSection({
        label: TESTIMONIALS_DATA.label,
        title: TESTIMONIALS_DATA.title,
        description: TESTIMONIALS_DATA.description,
      }),
      getPublicIndustriesAsLegacyResult(),
      getPublicPageHero("industries"),
      getPublicPageCta("industries"),
      getPublicSharedSection("testimonials"),
    ]);

  const industries = liveIndustries.failed
    ? INDUSTRIES_DATA.industries
    : liveIndustries.data;

  return (
    <main className="bg-background min-h-screen">
      <HeroV1Section
        label={hero?.label ?? "Industries"}
        title={
          hero?.title ??
          "Built for businesses where trust, presentation, and follow-up matter."
        }
        description={
          hero?.description ??
          "Twelve Creative works across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Each industry in depth */}
      <IndustriesDetailSection data={industries} />

      {/* Client voices from these industries */}
      <TestimonialSection
        data={testimonialsData}
        heading={testimonialsHeading}
      />

      {/* CTA */}
      {cta && <CTAV1Section data={toLegacyPageCta(cta)} />}
    </main>
  );
}
