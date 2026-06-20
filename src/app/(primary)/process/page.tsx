import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ProcessSection } from "@/components/sections/process-section";
import { CTA_PROCESS } from "@/data/page-ctas.data";
import { PROCESS_DATA } from "@/data/process.data";
import { getPublicPageHero, resolveVideoSrc, resolveThumbnail } from "@/lib/api/page-heroes";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process | How Twelve Creative Builds Growth Systems",
  description:
    "Learn how Twelve Creative approaches growth through diagnostics, positioning, creative production, system installation, and optimization.",
};

export default async function ProcessPage() {
  const [hero, settings] = await Promise.all([
    getPublicPageHero("process"),
    getPublicSiteSetting(),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "Our Process"}
        title={hero?.title ?? "Our process is built around clarity first."}
        description={hero?.description ?? "We do not begin by making random assets. We begin by understanding what the business is trying to move, where the friction is, and what structure needs to be built."}
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Interactive step overview */}
      <ProcessSection data={PROCESS_DATA} processThumbnail={settings.process_thumbnail || undefined} />

      {/* The Twelve Creative Difference */}
      <DifferenceSection />

      {/* CTA */}
      <CTASection data={CTA_PROCESS} />
    </main>
  );
}
