import { ServicesSection } from "@/components/sections/services-section";
import { CTASection } from "@/components/sections/cta-section";
import { GrowthSystemSection } from "@/components/sections/growth-system-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import { getPublicServicesAsLegacy } from "@/lib/api/services";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
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
    hero,
    services,
    cta,
    [coreHeading, servicesHeading, growthSystem, difference, whyChooseUs],
  ] = await Promise.all([
    getPublicPageHero("what-we-build"),
    getPublicServicesAsLegacy(),
    getPublicPageCta("what-we-build"),
    getPublicSharedSections([
      "core-verticals",
      "home-services",
      "growth-system",
      "difference",
      "why-choose-us",
    ]),
  ]);

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

      {/* Services — moved here from the home page: the deliverables follow
          naturally once someone has seen who we build for. */}
      <ServicesSection data={services} heading={servicesHeading} />

      {/* Growth system end-to-end deep dive */}
      {growthSystem && <GrowthSystemSection cmsData={growthSystem} />}

      {/* Why operators choose us */}
      {whyChooseUs && <WhyChooseUsSection cmsData={whyChooseUs} tone="brand" />}

      {/* CTA */}
      {cta && <CTASection data={toLegacyPageCta(cta)} />}
    </main>
  );
}
