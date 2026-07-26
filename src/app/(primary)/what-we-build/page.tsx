import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { AlternatingServicesSection } from "@/components/sections/alternating-services-section";
import { CoreVerticalsSection } from "@/components/sections/core-verticals-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { GrowthSystemSection } from "@/components/sections/growth-system-section";
import { ProcessSection } from "@/components/sections/process-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { SERVICES_DATA } from "@/data/services.data";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveVideoSrc,
  resolveThumbnail,
} from "@/lib/api/page-heroes";
import { getPublicIndustries } from "@/lib/api/industries";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicServicesAsLegacy } from "@/lib/api/services";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("what-we-build");
  return resolvePageMetadata(hero, {
    title: "What We Build | Positioning, Creative, Websites, Ads & CRM",
    description:
      "Explore Twelve Creative's work across positioning, video production, websites, paid ads, CRM, automation, and conversion systems.",
  });
}

export default async function WhatWeBuildPage() {
  const [
    live,
    hero,
    industries,
    settings,
    processData,
    cta,
    [coreHeading, growthSystem, difference, whyChooseUs],
  ] = await Promise.all([
    getPublicServicesAsLegacy(),
    getPublicPageHero("what-we-build"),
    getPublicIndustries(),
    getPublicSiteSetting(),
    getPublicProcessSection(),
    getPublicPageCta("what-we-build"),
    getPublicSharedSections([
      "core-verticals",
      "growth-system",
      "difference",
      "why-choose-us",
    ]),
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
      <CoreVerticalsSection industries={industries} heading={coreHeading} />

      {/* Detailed alternating service breakdowns */}
      <AlternatingServicesSection data={serviceItems} />

      {/* Growth system end-to-end deep dive */}
      {growthSystem && <GrowthSystemSection cmsData={growthSystem} />}

      {/* The Twelve Creative Difference */}
      {difference && (
        <DifferenceSection
          data={difference}
          howWeStructureImage={settings.how_we_structure_image || undefined}
        />
      )}

      {/* How we approach the work */}
      <ProcessSection
        data={processData}
        processThumbnail={processData.thumbnail}
      />

      {/* Why operators choose us */}
      {whyChooseUs && <WhyChooseUsSection cmsData={whyChooseUs} tone="brand" />}

      {/* CTA */}
      {cta && <CTASection data={toLegacyPageCta(cta)} />}
    </main>
  );
}
