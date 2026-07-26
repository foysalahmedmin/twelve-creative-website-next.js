import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ProcessSection } from "@/components/sections/process-section";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicSharedSection } from "@/lib/api/shared-sections";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("process");
  return resolvePageMetadata(hero, {
    title: "Process | How Twelve Creative Builds Growth Systems",
    description:
      "Learn how Twelve Creative approaches growth through diagnostics, positioning, creative production, system installation, and optimization.",
  });
}

export default async function ProcessPage() {
  const [hero, processData, difference, cta] = await Promise.all([
    getPublicPageHero("process"),
    getPublicProcessSection(),
    getPublicSharedSection("difference"),
    getPublicPageCta("process"),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Our Process"}
        title={hero?.title ?? "Our process is built around clarity first."}
        description={
          hero?.description ??
          "We do not begin by making random assets. We begin by understanding what the business is trying to move, where the friction is, and what structure needs to be built."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Interactive step overview */}
      <ProcessSection
        data={processData}
        processThumbnail={processData.thumbnail}
      />

      {/* The Twelve Creative Difference */}
      {difference && <DifferenceSection data={difference} />}

      {/* CTA */}
      {cta && <CTASection data={toLegacyPageCta(cta)} />}
    </main>
  );
}
