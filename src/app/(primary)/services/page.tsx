import { PageHeader } from "@/components/sections/page-header-section";

// Import Reusable Modern Sections
import { PageContactSection } from "@/components/sections/contact-section-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { PodcastInsight } from "@/components/sections/podcast-insight";
import { PodcastSliderSection } from "@/components/sections/podcast-slider-section";
import { PodcastVideoSwiperSection } from "@/components/sections/podcast-video-swiper-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { SaasInsight } from "@/components/sections/saas-insight";
import { ServiceServicesSection } from "@/components/sections/service-services-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";

// Import Static Mock Datasets
import { CANVAS_PODCAST_INSIGHT_DATA } from "@/data/podcast-insight.data";
import { PODCAST_SLIDER_DATA } from "@/data/podcast-slider.data";
import { PODCAST_VIDEO_DATA } from "@/data/podcast-video-swiper.data";
import { PRICING_DATA } from "@/data/pricing.data";
import { SERVICE_SERVICES_DATA } from "@/data/service-services-section.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";

import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { FAQS_DATA } from "@/data/faqs.data";
import { PROCESS_DATA } from "@/data/process.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Catalog & Reusable Canvas | Twelve Creative",
  description:
    "Preview playground for all reusable high-fidelity sections designed for Twelve Creative pages.",
};

export default function ServicesPage() {
  return (
    <main className="bg-background min-h-screen space-y-12 pb-20 sm:space-y-16">
      {/* 1. Page Header (Preview Component) */}
      <PageHeader
        label="Canvas Playroom"
        title="Premium Reusable Sections Canvas"
        description="Interact and preview the complete catalog of twelve premium components designed to be fully dynamic, responsive, and reusable across all marketing subpages."
        breadcrumb={[{ label: "Services Preview", active: true }]}
        videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />

      {/* 2. Page Why Choose Us Section */}
      <div className="border-primary/5 border-t pt-8">
        <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} />
      </div>

      {/* 3. Page Pricing Section */}
      <div className="border-primary/5 border-t pt-8">
        <PricingSection pricing={PRICING_DATA} />
      </div>

      {/* 3.5. Page Service Grid Section */}
      <div className="border-primary/5 border-t pt-8">
        <ServiceServicesSection data={SERVICE_SERVICES_DATA} />
      </div>

      {/* 4. Scroll-Spy Page Process Section */}
      <div className="border-primary/5 border-t pt-8">
        <ProcessSection data={PROCESS_DATA} />
      </div>

      {/* 5. Podcast Insights Vertical Stepper Section */}
      <div className="border-primary/5 border-t pt-8">
        <PodcastInsight data={CANVAS_PODCAST_INSIGHT_DATA} />
      </div>

      {/* 6. SaaS conversion Insight Section */}
      <div className="border-primary/5 border-t pt-8">
        <SaasInsight />
      </div>

      {/* 7. Triple-Column Alternating Vertical Marquee Slider */}
      <div className="border-primary/5 border-t pt-8">
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

      {/* 8. Show Packaging Cover Slider (Swiper Coverflow) */}
      <div className="border-primary/5 border-t pt-8">
        <PodcastSliderSection data={PODCAST_SLIDER_DATA} />
      </div>

      {/* 9. Production Video Swiper (Scale Active Swiper) */}
      <div className="border-primary/5 border-t pt-8">
        <PodcastVideoSwiperSection data={PODCAST_VIDEO_DATA} />
      </div>

      {/* 10. Thumbnail Work Portfolio Grid */}
      <div className="border-primary/5 border-t pt-8">
        <ThumbnailWorkSection works={CANVAS_PORTFOLIO_DATA} slug="creative" />
      </div>

      {/* 11. Dual-Row Video & Message Marquee Testimonials */}
      <div className="border-primary/5 border-t pt-8">
        <TestimonialSection data={TESTIMONIALS_DATA} />
      </div>

      {/* 12. Two-Column Accordion FAQ Section */}
      <div className="border-primary/5 border-t pt-8">
        <FaqSection data={FAQS_DATA} />
      </div>

      {/* 13. High-Fidelity Contact Section with Inquiry Form */}
      <div className="border-primary/5 border-t pt-8">
        <PageContactSection />
      </div>
    </main>
  );
}
