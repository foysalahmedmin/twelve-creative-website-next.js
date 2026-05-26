import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { BookingInlineSection } from "@/components/sections/booking-inline-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { WorkWithUsSection } from "@/components/sections/work-with-us-section";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { VERTICALS_DATA } from "@/data/verticals.data";
import {
  getPublicShowcaseVideosForMarquee,
  getPublicShowcaseVideosForThumbnailGrid,
} from "@/lib/api/showcase-videos";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return VERTICALS_DATA.filter((v) => v.href.startsWith("/verticals/")).map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vertical = VERTICALS_DATA.find((v) => v.id === id);
  if (!vertical) return {};
  return {
    title: `${vertical.title} | Twelve Creative`,
    description: vertical.body,
  };
}

export default async function VerticalDetailPage({ params }: Props) {
  const { id } = await params;
  const vertical = VERTICALS_DATA.find((v) => v.id === id);
  if (!vertical) notFound();

  const [showcaseVideos, livePortfolio, testimonialsData] = await Promise.all([
    getPublicShowcaseVideosForMarquee(),
    getPublicShowcaseVideosForThumbnailGrid({
      label: CANVAS_PORTFOLIO_DATA.label,
      title: CANVAS_PORTFOLIO_DATA.title,
      description: CANVAS_PORTFOLIO_DATA.description,
      type: CANVAS_PORTFOLIO_DATA.type,
    }),
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
  ]);

  const marqueeData = showcaseVideos.length
    ? showcaseVideos
    : CANVAS_MARQUEE_DATA;
  const portfolioData = livePortfolio.work.length
    ? livePortfolio
    : CANVAS_PORTFOLIO_DATA;

  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        {/* Background image */}
        <img
          src={vertical.image}
          alt={vertical.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 container pt-24 pb-16 lg:pb-20">
          <ScrollReveal animation="fade-in-up" durationMs={700}>
            <span className="mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
              {vertical.tagline}
            </span>
            <h1 className="font-heading mb-6 text-5xl leading-[110%] font-bold tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              {vertical.title}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
              {vertical.body}
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold tracking-widest text-black uppercase transition-all hover:bg-white/90"
            >
              Start a Conversation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialSection data={testimonialsData} />

      {/* ── Visual Library ── */}
      <section className="py-16 sm:py-20 lg:py-24">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="Visual Library"
            title="A live look at the work."
            description="Frames from recent campaigns across hospitality, real estate, aviation, and professional services."
            className="mb-10 lg:mb-12"
          />
        </ScrollReveal>
        <VerticalMarqueeSlider data={marqueeData} speed={30} pauseOnHover />
      </section>

      {/* ── Work Showcase ── */}
      <ThumbnailWorkSection works={portfolioData} slug={id} />

      {/* ── Work With Us ── */}
      <WorkWithUsSection />

      {/* ── Inline Booking ── */}
      <BookingInlineSection />
    </div>
  );
}
