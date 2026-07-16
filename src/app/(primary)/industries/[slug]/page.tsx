import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { BookingInlineSection } from "@/components/sections/booking-inline-section";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ScrollStatementSection } from "@/components/sections/scroll-statement-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { WorkWithUsSection } from "@/components/sections/work-with-us-section";
import { CTA_ABOUT } from "@/data/page-ctas.data";
import { PROCESS_DATA } from "@/data/process.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import {
  getPublicIndustries,
  resolveIndustryThumbnail,
  resolveIndustryVideoSrc,
} from "@/lib/api/industries";
import {
  getPublicShowcaseVideosForMarquee,
  getPublicShowcaseVideosForThumbnailGrid,
} from "@/lib/api/showcase-videos";
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
  const industries = await getPublicIndustries();
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Marketing | Twelve Creative`,
    description: industry.headline,
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;

  const [
    industries,
    showcaseVideos,
    livePortfolio,
    testimonialsData,
    settings,
  ] = await Promise.all([
    getPublicIndustries(),
    getPublicShowcaseVideosForMarquee({ industrySlug: slug }),
    getPublicShowcaseVideosForThumbnailGrid(
      {
        label: CANVAS_PORTFOLIO_DATA.label,
        title: CANVAS_PORTFOLIO_DATA.title,
        description: CANVAS_PORTFOLIO_DATA.description,
        type: CANVAS_PORTFOLIO_DATA.type,
      },
      { industrySlug: slug },
    ),
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
    getPublicSiteSetting(),
  ]);

  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const videoSrc = resolveIndustryVideoSrc(industry.video);
  const thumbnailSrc = resolveIndustryThumbnail(
    industry.thumbnail,
    industry.video,
  );

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero ── */}
      <PageHeader
        label={industry.tagline ?? industry.name}
        title={industry.headline}
        description={industry.description}
        videoSrc={videoSrc}
        thumbnailSrc={thumbnailSrc}
      />

      {/* ── Brands ── */}
      <BrandsStrip />

      {/* ── Scroll-reveal statement ── */}
      <ScrollStatementSection />

      {/* ── Inline Booking ── */}
      <BookingInlineSection calendlyUrl={settings.calendly_url || undefined} />

      {/* ── Testimonials ── */}
      <TestimonialSection data={testimonialsData} />

      {/* ── Visual Library ── */}
      {showcaseVideos.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24">
          <ScrollReveal animation="fade-in-up" durationMs={800}>
            <CenteredSectionHeader
              label="Visual Library"
              title="A live look at the work."
              description={`Frames from recent ${industry.name.toLowerCase()} campaigns — content, ads, and brand assets built to perform.`}
              className="mb-10 lg:mb-12"
            />
          </ScrollReveal>
          <VerticalMarqueeSlider
            data={showcaseVideos}
            speed={30}
            pauseOnHover
          />
        </section>
      )}

      {/* ── Work With Us ── */}
      <WorkWithUsSection />

      {/* ── Work Showcase ── */}
      {livePortfolio.work.length > 0 && (
        <ThumbnailWorkSection works={livePortfolio} showViewMore={false} />
      )}

      {/* ── Process ── */}
      <ProcessSection data={PROCESS_DATA} />

      {/* CTA */}
      <CTASection data={CTA_ABOUT} />
    </div>
  );
}
