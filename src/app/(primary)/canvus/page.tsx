import { BookingSection } from "@/components/sections/booking-section";
import { BrandsSection } from "@/components/sections/brands-section";
import { ContactInfoMapSection } from "@/components/sections/contact-info-map-section";
import { ContactSection } from "@/components/sections/contact-section";
import { PageContactSection } from "@/components/sections/contact-section-section";
import { CTASection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { GalleryMarqueeSection } from "@/components/sections/gallery-marquee-section";
import { OurMissionSection } from "@/components/sections/our-mission-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { GrowthSystemSection } from "@/components/sections/growth-system-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SaasInsight } from "@/components/sections/saas-insight";
import { ServiceServicesSection } from "@/components/sections/service-services-section";
import { StorySection } from "@/components/sections/story-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";

import { CONTACT_PAGE_DATA } from "@/data/contact.data";
import { FAQS_DATA } from "@/data/faqs.data";
import { CTA_PROCESS } from "@/data/page-ctas.data";
import { SERVICE_SERVICES_DATA } from "@/data/service-services-section.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicAboutPage } from "@/lib/api/about-page";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import { getPublicIndustryOptions } from "@/lib/api/industries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Catalog & Reusable Canvas | Twelve Creative",
  description:
    "Preview playground for all reusable high-fidelity sections designed for Twelve Creative pages.",
};

export default async function CanvasPage() {
  const [
    testimonialsData,
    processData,
    industries,
    about,
    [
      whyChooseUs,
      growthSystem,
      workShowcaseHeading,
      testimonialsHeading,
      faqHeading,
    ],
  ] = await Promise.all([
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
    getPublicProcessSection(),
    getPublicIndustryOptions(),
    getPublicAboutPage(),
    getPublicSharedSections([
      "why-choose-us",
      "growth-system",
      "work-showcase",
      "testimonials",
      "faq",
    ]),
  ]);

  return (
    <main className="bg-background min-h-screen space-y-12 pb-20 sm:space-y-16">
      <PageHeader
        label="Canvas Playroom"
        title="Premium Reusable Sections Canvas"
        description="Interact and preview the complete catalog of premium components designed to be fully dynamic, responsive, and reusable across all marketing subpages."
      />

      <BrandsSection />

      {about && (
        <>
          <OurMissionSection
            section={about.mission_section}
            mission={about.mission}
            vision={about.vision}
          />

          <StorySection
            section={about.story_section}
            cards={about.story_cards}
          />
        </>
      )}

      <TeamSection />

      {about && (
        <GalleryMarqueeSection
          section={about.gallery_section}
          items={about.gallery}
        />
      )}

      {whyChooseUs && <WhyChooseUsSection cmsData={whyChooseUs} />}

      <ServiceServicesSection data={SERVICE_SERVICES_DATA} />

      <ProcessSection data={processData} />

      {growthSystem && <GrowthSystemSection cmsData={growthSystem} />}

      <SaasInsight />

      <div>
        <div className="container space-y-2 py-8 text-center">
          <span className="bg-primary/10 text-primary border-primary/20 inline-flex rounded-full border px-3.5 py-1 text-xs font-bold tracking-widest uppercase">
            Interactive Widget
          </span>
          <h3 className="font-heading text-foreground text-2xl font-medium sm:text-3xl">
            Continuous Vertical Marquee Columns
          </h3>
          <p className="text-muted-foreground mx-auto max-w-lg text-sm">
            Columns autoscroll endlessly in alternating vertical directions.
            Hover to pause and click any video card to play!
          </p>
        </div>
        <VerticalMarqueeSlider
          data={CANVAS_MARQUEE_DATA}
          speed={30}
          pauseOnHover={true}
        />
      </div>

      <ThumbnailWorkSection
        works={CANVAS_PORTFOLIO_DATA}
        slug="creative"
        heading={workShowcaseHeading}
      />

      <TestimonialSection
        data={testimonialsData}
        heading={testimonialsHeading}
      />

      <CTASection data={CTA_PROCESS} />

      <FaqSection data={FAQS_DATA} heading={faqHeading} />

      <BookingSection
        label={CONTACT_PAGE_DATA.booking.label}
        title={CONTACT_PAGE_DATA.booking.title}
        description={CONTACT_PAGE_DATA.booking.description}
        industries={industries}
      />

      <ContactInfoMapSection
        label={CONTACT_PAGE_DATA.map.label}
        title={CONTACT_PAGE_DATA.map.title}
        description={CONTACT_PAGE_DATA.map.description}
        cards={CONTACT_PAGE_DATA.contact_cards}
        map={{
          address: CONTACT_PAGE_DATA.map.address,
          embed_src: CONTACT_PAGE_DATA.map.embed_src,
        }}
      />

      <PageContactSection industries={industries} />

      <ContactSection />
    </main>
  );
}
