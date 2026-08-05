import { BookingInlineSection } from "@/components/sections/booking-inline-section";
import { BrandsStrip } from "@/components/sections/brands-strip";
import {
  CTAV1Section,
  type TCTAV1Data,
} from "@/components/sections/cta-v1-section";
import { HeroV1Section } from "@/components/sections/hero-v1-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ScrollStatementSection } from "@/components/sections/scroll-statement-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { WorkWithUsSection } from "@/components/sections/work-with-us-section";
import { CTA_ABOUT } from "@/data/cta-v1.data";
import type { TProcessData } from "@/data/process.data";
import type { TTestimonialData } from "@/data/testimonials.data";
import type { TPortfolioData } from "@/data/thumbnail-work-section.data";
import {
  resolveIndustryThumbnail,
  resolveIndustryVideoSrc,
  type ApiIndustry,
  type PublicIndustryOption,
} from "@/lib/api/industries";
import type {
  ScrollStatementSection as CmsScrollStatementSection,
  WorkWithUsSection as CmsWorkWithUsSection,
  HeadingSection,
} from "@/lib/api/shared-sections";
import type { ReactNode } from "react";

/**
 * Typed escape hatches for future CMS-managed Industry page sections. A key
 * that is omitted renders the stable built-in section; a key explicitly set
 * to `null` hides it. This keeps route composition shared without turning the
 * site into an untyped page builder.
 */
export interface IndustryDetailSlots {
  brands?: ReactNode;
  statement?: ReactNode;
  booking?: ReactNode;
  testimonials?: ReactNode;
  workWithUs?: ReactNode;
  visualLibrary?: ReactNode;
  workShowcase?: ReactNode;
  process?: ReactNode;
  cta?: ReactNode;
}

export interface IndustryDetailSharedContent {
  statement?: CmsScrollStatementSection | null;
  workWithUs?: CmsWorkWithUsSection | null;
  testimonialsHeading?: HeadingSection | null;
  visualLibraryHeading?: HeadingSection | null;
  workShowcaseHeading?: HeadingSection | null;
}

interface IndustryDetailViewProps {
  industry: ApiIndustry;
  industryOptions: PublicIndustryOption[];
  portfolio: TPortfolioData;
  testimonials: TTestimonialData;
  process: TProcessData;
  calendlyUrl?: string;
  ctaData?: TCTAV1Data | null;
  sharedContent?: IndustryDetailSharedContent;
  slots?: IndustryDetailSlots;
}

export function IndustryDetailView({
  industry,
  industryOptions,
  portfolio,
  testimonials,
  process,
  calendlyUrl,
  ctaData,
  sharedContent,
  slots = {},
}: IndustryDetailViewProps) {
  const videoSrc = resolveIndustryVideoSrc(industry.video);
  const thumbnailSrc = resolveIndustryThumbnail(
    industry.thumbnail,
    industry.video,
  );
  const resolvedCta: TCTAV1Data | null =
    ctaData === null
      ? null
      : (ctaData ??
        ({
          ...CTA_ABOUT,
          href: industry.cta_href?.trim() || CTA_ABOUT.href,
          buttonText: industry.cta_label?.trim() || CTA_ABOUT.buttonText,
        } satisfies TCTAV1Data));

  const renderSlot = (key: keyof IndustryDetailSlots, fallback: ReactNode) =>
    Object.prototype.hasOwnProperty.call(slots, key) ? slots[key] : fallback;

  return (
    <div className="bg-background min-h-screen">
      <HeroV1Section
        label={industry.tagline ?? industry.name}
        title={industry.headline}
        description={industry.description}
        videoSrc={videoSrc}
        thumbnailSrc={thumbnailSrc}
      />

      {renderSlot("brands", <BrandsStrip />)}
      {renderSlot(
        "statement",
        sharedContent?.statement === null ? null : (
          <ScrollStatementSection data={sharedContent?.statement} />
        ),
      )}
      {renderSlot(
        "booking",
        <BookingInlineSection
          calendlyUrl={calendlyUrl}
          industries={industryOptions}
        />,
      )}
      {renderSlot(
        "testimonials",
        <TestimonialSection
          data={testimonials}
          heading={sharedContent?.testimonialsHeading}
        />,
      )}
      {renderSlot(
        "workWithUs",
        sharedContent?.workWithUs === null ? null : (
          <WorkWithUsSection data={sharedContent?.workWithUs} />
        ),
      )}
      {renderSlot(
        "workShowcase",
        portfolio.work.length > 0 ? (
          <ThumbnailWorkSection
            works={portfolio}
            heading={sharedContent?.workShowcaseHeading}
            showViewMore={false}
          />
        ) : null,
      )}
      {renderSlot("process", <ProcessSection data={process} />)}
      {renderSlot(
        "cta",
        resolvedCta ? <CTAV1Section data={resolvedCta} /> : null,
      )}
    </div>
  );
}
