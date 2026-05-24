import { WorksCard } from "@/components/cards/works-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { CTA_WORKS } from "@/data/page-ctas.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { WORKS_PAGE_MOCK_DATA } from "@/data/works.data";
import {
  getPublicShowcaseVideosForMarquee,
  getPublicShowcaseVideosForThumbnailGrid,
} from "@/lib/api/showcase-videos";
import { getPublicPageHero, resolveVideoSrc } from "@/lib/api/page-heroes";
import { adaptWorkToLegacy, getPublicWorks } from "@/lib/api/works";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Twelve Creative Case Studies",
  description:
    "See how Twelve Creative helps businesses improve visibility, trust, campaigns, content, and conversion systems.",
};

export default async function WorksPage() {
  const [showcaseVideos, liveWorks, livePortfolio, hero] = await Promise.all([
    getPublicShowcaseVideosForMarquee(),
    getPublicWorks(),
    getPublicShowcaseVideosForThumbnailGrid({
      label: CANVAS_PORTFOLIO_DATA.label,
      title: CANVAS_PORTFOLIO_DATA.title,
      description: CANVAS_PORTFOLIO_DATA.description,
      type: CANVAS_PORTFOLIO_DATA.type,
    }),
    getPublicPageHero("works"),
  ]);
  const marqueeData = showcaseVideos.length ? showcaseVideos : CANVAS_MARQUEE_DATA;
  const works = liveWorks.length ? liveWorks.map(adaptWorkToLegacy) : WORKS_PAGE_MOCK_DATA;
  const portfolioData = livePortfolio.work.length
    ? livePortfolio
    : CANVAS_PORTFOLIO_DATA;

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Work"}
        title={hero?.title ?? "Work built around business context."}
        description={hero?.description ?? "Our work is not measured by how it looks in isolation. It is measured by whether it helps the business become clearer, more credible, and better equipped to convert attention into action."}
        videoSrc={resolveVideoSrc(hero?.video)}
      />

      {/* Brands */}
      <BrandsStrip />

      {/* Case Studies / Works Grid Section */}
      <section className="border-primary/5 container border-t py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {works.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="fade-in-up"
              delayMs={index * 150}
              className="flex h-full"
            >
              <WorksCard item={item} className="h-full w-full" />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Vertical marquee — visual asset showcase */}
      <section className="py-16 sm:py-20 lg:py-24">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="Visual Library"
            title="A live look at the work."
            description="Frames from recent hospitality, real estate, aviation, and professional service campaigns. Hover to pause, click any tile to play."
            className="mb-10 lg:mb-12"
          />
        </ScrollReveal>
        <VerticalMarqueeSlider
          data={marqueeData}
          speed={30}
          pauseOnHover
        />
      </section>

      {/* Additional work showcase */}
      <ThumbnailWorkSection works={portfolioData} slug="works" />
      {/* CTA */}
      <CTASection data={CTA_WORKS} />
    </main>
  );
}
