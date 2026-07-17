import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { AlternatingServicesSection } from "@/components/sections/alternating-services-section";
import { CoreVerticalsSection } from "@/components/sections/core-verticals-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { GrowthSystemSection } from "@/components/sections/growth-system-section";
import { ProcessSection } from "@/components/sections/process-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { CTA_WHAT_WE_BUILD } from "@/data/page-ctas.data";
import { GROWTH_SYSTEM_DATA } from "@/data/growth-system.data";
import { PROCESS_DATA } from "@/data/process.data";
import { SERVICES_DATA } from "@/data/services.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import {
  getPublicPageHero,
  resolveVideoSrc,
  resolveThumbnail,
} from "@/lib/api/page-heroes";
import { getPublicIndustries } from "@/lib/api/industries";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicServicesAsLegacy } from "@/lib/api/services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What We Build | Positioning, Creative, Websites, Ads & CRM",
  description:
    "Explore Twelve Creative's work across positioning, video production, websites, paid ads, CRM, automation, and conversion systems.",
};

export default async function WhatWeBuildPage() {
  const [live, hero, industries, settings] = await Promise.all([
    getPublicServicesAsLegacy(),
    getPublicPageHero("what-we-build"),
    getPublicIndustries(),
    getPublicSiteSetting(),
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
        title={
          hero?.title ?? "Marketing works better when the pieces are connected."
        }
        description={
          hero?.description ??
          "Twelve Creative builds the creative, strategic, and operational pieces that help a business move from visibility to revenue."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Core Verticals */}
      <CoreVerticalsSection industries={industries} />

      {/* Detailed alternating service breakdowns */}
      <AlternatingServicesSection data={serviceItems} />

      {/* Growth system end-to-end deep dive */}
      <GrowthSystemSection data={GROWTH_SYSTEM_DATA} />

      {/* The Twelve Creative Difference */}
      <DifferenceSection
        howWeStructureImage={settings.how_we_structure_image || undefined}
      />

      {/* How we approach the work */}
      <ProcessSection
        data={PROCESS_DATA}
        processThumbnail={settings.process_thumbnail || undefined}
      />

      {/* Why operators choose us */}
      <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} tone="brand" />

      {/* CTA */}
      <CTASection data={CTA_WHAT_WE_BUILD} />
    </main>
  );
}
