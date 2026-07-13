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
import { GROWTH_SYSTEM_DATA } from "@/data/growth-system.data";
import { PROCESS_DATA } from "@/data/process.data";
import { SERVICE_SERVICES_DATA } from "@/data/service-services-section.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Catalog & Reusable Canvas | Twelve Creative",
  description:
    "Preview playground for all reusable high-fidelity sections designed for Twelve Creative pages.",
};

export default async function CanvasPage() {
  const testimonialsData = await getPublicTestimonialsForSection({
    label: TESTIMONIALS_DATA.label,
    title: TESTIMONIALS_DATA.title,
    description: TESTIMONIALS_DATA.description,
  });

  return (
    <main className="bg-background min-h-screen space-y-12 pb-20 sm:space-y-16">
      <PageHeader
        label="Canvas Playroom"
        title="Premium Reusable Sections Canvas"
        description="Interact and preview the complete catalog of premium components designed to be fully dynamic, responsive, and reusable across all marketing subpages."
      />

      <BrandsSection />

      <OurMissionSection />

      <StorySection />

      <TeamSection />

      <GalleryMarqueeSection />

      <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} />

      <ServiceServicesSection data={SERVICE_SERVICES_DATA} />

      <ProcessSection data={PROCESS_DATA} />

      <GrowthSystemSection data={GROWTH_SYSTEM_DATA} />

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

      <ThumbnailWorkSection works={CANVAS_PORTFOLIO_DATA} slug="creative" />

      <TestimonialSection data={testimonialsData} />

      <CTASection data={CTA_PROCESS} />

      <FaqSection data={FAQS_DATA} />

      <BookingSection
        label={CONTACT_PAGE_DATA.booking.label}
        title={CONTACT_PAGE_DATA.booking.title}
        description={CONTACT_PAGE_DATA.booking.description}
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

      <PageContactSection />

      <ContactSection />
    </main>
  );
}
