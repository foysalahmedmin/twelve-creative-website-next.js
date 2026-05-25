import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { AlternatingServicesSection } from "@/components/sections/alternating-services-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { PodcastInsight } from "@/components/sections/podcast-insight";
import { ProcessSection } from "@/components/sections/process-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { CTA_WHAT_WE_BUILD } from "@/data/page-ctas.data";
import { CANVAS_PODCAST_INSIGHT_DATA } from "@/data/podcast-insight.data";
import { PROCESS_DATA } from "@/data/process.data";
import { SERVICES_DATA } from "@/data/services.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { getPublicPageHero, resolveVideoSrc, resolveThumbnail } from "@/lib/api/page-heroes";
import { getPublicServicesAsLegacy } from "@/lib/api/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Build | Positioning, Creative, Websites, Ads & CRM",
  description:
    "Explore Twelve Creative's work across positioning, video production, websites, paid ads, CRM, automation, and conversion systems.",
};

export default async function WhatWeBuildPage() {
  const [live, hero] = await Promise.all([
    getPublicServicesAsLegacy(),
    getPublicPageHero("what-we-build"),
  ]);
  const source = live.length ? live : SERVICES_DATA;
  const serviceItems = source.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    highlights: service.highlights,
    thumbnail_src: service.thumbnail_src,
  }));

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "What We Build"}
        title={hero?.title ?? "Marketing works better when the pieces are connected."}
        description={hero?.description ?? "Twelve Creative builds the creative, strategic, and operational pieces that help a business move from visibility to revenue."}
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Detailed alternating service breakdowns */}
      <AlternatingServicesSection data={serviceItems} />

      {/* Growth system end-to-end deep dive */}
      <PodcastInsight data={CANVAS_PODCAST_INSIGHT_DATA} />

      {/* The Twelve Creative Difference */}
      <DifferenceSection />

      {/* How we approach the work */}
      <ProcessSection data={PROCESS_DATA} />

      {/* Why operators choose us */}
      <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} />

      {/* CTA */}
      <CTASection data={CTA_WHAT_WE_BUILD} />
    </main>
  );
}
