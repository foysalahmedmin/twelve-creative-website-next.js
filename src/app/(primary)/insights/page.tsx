import { InsightCard } from "@/components/cards/insight-card";
import { ComingSoon } from "@/components/common/coming-soon";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { HeroV1Section } from "@/components/sections/hero-v1-section";
import { INSIGHTS_DATA } from "@/data/insights.data";
import { getPublicInsights } from "@/lib/api/insights";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("insights");
  return resolvePageMetadata(hero, {
    title: "Insights | Twelve Creative",
    description:
      "Notes on positioning, creative, distribution, and the systems behind real business growth.",
  });
}

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const [insights, hero] = await Promise.all([
    getPublicInsights(),
    getPublicPageHero("insights"),
  ]);

  // If nothing is published yet, keep the "Coming Soon" experience —
  // the page goes live the moment the first article is published.
  if (!insights.length) return <ComingSoon title="Insights" />;

  return (
    <main className="bg-background min-h-screen">
      <HeroV1Section
        label={hero?.label ?? INSIGHTS_DATA.label}
        title={
          hero?.title ?? "Notes on positioning, creative, and growth systems."
        }
        description={
          hero?.description ??
          "Field-tested thinking from the work we do for hospitality, real estate, ventures, and professional service operators."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      <section className="container py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((article, idx) => (
            <ScrollReveal
              key={article._id}
              animation="fade-in-up"
              delayMs={idx * 100}
              className="h-full"
            >
              <InsightCard item={article} className="h-full" />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
