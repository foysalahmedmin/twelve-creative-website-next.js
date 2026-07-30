import { IndustryDetailView } from "@/components/industry/industry-detail-view";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import {
  getPublicIndustries,
  getPublicIndustriesResult,
} from "@/lib/api/industries";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import { getPublicShowcaseVideosForThumbnailGrid } from "@/lib/api/showcase-videos";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const industries = await getPublicIndustries();
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicIndustriesResult();
  if (result.failed) throw new Error("Unable to load Industry metadata");
  const industry = result.data.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Marketing | Twelve Creative`,
    description: industry.headline,
    alternates: { canonical: `/industries/${slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function IndustryMarketingPage({ params }: Props) {
  const { slug } = await params;

  const [
    industriesResult,
    livePortfolio,
    testimonialsData,
    settings,
    processData,
    cta,
    [
      statement,
      workWithUs,
      testimonialsHeading,
      visualLibraryHeading,
      workShowcaseHeading,
    ],
  ] = await Promise.all([
    getPublicIndustriesResult(),
    getPublicShowcaseVideosForThumbnailGrid(
      {
        label: CANVAS_PORTFOLIO_DATA.label,
        title: CANVAS_PORTFOLIO_DATA.title,
        description: CANVAS_PORTFOLIO_DATA.description,
        type: CANVAS_PORTFOLIO_DATA.type,
      },
      { industrySlug: slug },
    ),
    getPublicTestimonialsForSection(
      {
        label: TESTIMONIALS_DATA.label,
        title: TESTIMONIALS_DATA.title,
        description: TESTIMONIALS_DATA.description,
      },
      { industrySlug: slug },
    ),
    getPublicSiteSetting(),
    getPublicProcessSection(),
    getPublicPageCta("industry-detail", { industrySlug: slug }),
    getPublicSharedSections([
      "scroll-statement",
      "work-with-us",
      "testimonials",
      "visual-library",
      "work-showcase",
    ]),
  ]);

  if (industriesResult.failed) {
    throw new Error("Industries are temporarily unavailable");
  }
  const industries = industriesResult.data;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  return (
    <IndustryDetailView
      industry={industry}
      industryOptions={industries.map(({ _id, name, slug: optionSlug }) => ({
        _id,
        name,
        slug: optionSlug,
      }))}
      portfolio={livePortfolio}
      testimonials={testimonialsData}
      process={processData}
      calendlyUrl={settings.calendly_url || undefined}
      ctaData={cta ? toLegacyPageCta(cta) : null}
      sharedContent={{
        statement,
        workWithUs,
        testimonialsHeading,
        visualLibraryHeading,
        workShowcaseHeading,
      }}
    />
  );
}
