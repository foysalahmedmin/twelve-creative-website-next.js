import { WorksCard } from "@/components/cards/works-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { CoreVerticalsSection } from "@/components/sections/core-verticals-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { CTA_WORKS } from "@/data/page-ctas.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { getPublicIndustries } from "@/lib/api/industries";
import {
  getPublicPageHero,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicShowcaseVideosForThumbnailGrid } from "@/lib/api/showcase-videos";
import { adaptWorkToLegacy, getPublicWorks } from "@/lib/api/works";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Twelve Creative Case Studies",
  description:
    "See how Twelve Creative helps businesses improve visibility, trust, campaigns, content, and conversion systems.",
};

export default async function WorksPage() {
  const [liveWorks, livePortfolio, hero, industries] = await Promise.all([
    getPublicWorks(),
    getPublicShowcaseVideosForThumbnailGrid({
      label: CANVAS_PORTFOLIO_DATA.label,
      title: CANVAS_PORTFOLIO_DATA.title,
      description: CANVAS_PORTFOLIO_DATA.description,
      type: CANVAS_PORTFOLIO_DATA.type,
    }),
    getPublicPageHero("works"),
    getPublicIndustries(),
  ]);
  const works = liveWorks.map(adaptWorkToLegacy);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Work"}
        title={hero?.title ?? "Work built around business context."}
        description={
          hero?.description ??
          "Our work is not measured by how it looks in isolation. It is measured by whether it helps the business become clearer, more credible, and better equipped to convert attention into action."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Brands */}
      <BrandsStrip />

      {/* Case Studies / Works Grid Section */}
      {works.length > 0 && (
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
      )}

      {/* Additional work showcase */}
      {livePortfolio.work.length > 0 && (
        <ThumbnailWorkSection works={livePortfolio} showViewMore={false} />
      )}

      {/* Core Verticals */}
      <CoreVerticalsSection industries={industries} tone="brand" />

      {/* CTA */}
      <CTASection data={CTA_WORKS} />
    </main>
  );
}
