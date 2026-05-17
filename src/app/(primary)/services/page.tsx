import { PageHeader } from "@/components/sections/page-header-section";

// Import Reusable Modern Sections
import { PageWhyChooseUs } from "@/components/sections/page-why-choose-us";
import { PagePricing } from "@/components/sections/page-pricing";
import { PageServiceSection } from "@/components/sections/page-service-section";
import { PageProcessSection } from "@/components/sections/page-process-section";
import { PodcastInsight } from "@/components/sections/podcast-insight";
import { SaasInsight } from "@/components/sections/saas-insight";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { PodcastSlider } from "@/components/sections/podcast-slider";
import { PodcastVideoSwiper } from "@/components/sections/podcast-video-swiper";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { ServiceTestimonial } from "@/components/sections/service-testimonial";
import { PageFaqSection } from "@/components/sections/page-faq-section";
import { PageContactSection } from "@/components/sections/page-contact-section";

// Import Static Mock Datasets
import { CANVAS_WHY_CHOOSE_US_DATA } from "@/data/page-why-choose-us.data";
import { CANVAS_PRICING_DATA } from "@/data/page-pricing.data";
import { CANVAS_SERVICE_DATA } from "@/data/page-service-section.data";
import { CANVAS_PROCESS_DATA } from "@/data/page-process-section.data";
import { CANVAS_PODCAST_INSIGHT_DATA } from "@/data/podcast-insight.data";
import { CANVAS_PODCAST_VIDEO_SWIPER_DATA } from "@/data/podcast-video-swiper.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { CANVAS_TESTIMONIALS_DATA } from "@/data/service-testimonial.data";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services Catalog & Reusable Canvas | Twelve Creative",
  description: "Preview playground for all reusable high-fidelity sections designed for Twelve Creative pages.",
};

export default function ServicesPage() {
  return (
    <main className="bg-background min-h-screen space-y-12 sm:space-y-16 pb-20">
      
      {/* 1. Page Header (Preview Component) */}
      <PageHeader
        label="Canvas Playroom"
        title="Premium Reusable Sections Canvas"
        description="Interact and preview the complete catalog of twelve premium components designed to be fully dynamic, responsive, and reusable across all marketing subpages."
        breadcrumb={[{ label: "Services Preview", active: true }]}
        videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />

      {/* 2. Page Why Choose Us Section */}
      <div className="border-t border-primary/5 pt-8">
        <PageWhyChooseUs data={CANVAS_WHY_CHOOSE_US_DATA} />
      </div>

      {/* 3. Page Pricing Section */}
      <div className="border-t border-primary/5 pt-8">
        <PagePricing pricing={CANVAS_PRICING_DATA} />
      </div>

      {/* 3.5. Page Service Grid Section */}
      <div className="border-t border-primary/5 pt-8">
        <PageServiceSection data={CANVAS_SERVICE_DATA} />
      </div>

      {/* 4. Scroll-Spy Page Process Section */}
      <div className="border-t border-primary/5 pt-8">
        <PageProcessSection data={CANVAS_PROCESS_DATA} interactive={true} />
      </div>

      {/* 5. Podcast Insights Vertical Stepper Section */}
      <div className="border-t border-primary/5 pt-8">
        <PodcastInsight data={CANVAS_PODCAST_INSIGHT_DATA} />
      </div>

      {/* 6. SaaS conversion Insight Section */}
      <div className="border-t border-primary/5 pt-8">
        <SaasInsight />
      </div>

      {/* 7. Triple-Column Alternating Vertical Marquee Slider */}
      <div className="border-t border-primary/5 pt-8">
        <div className="container py-8 text-center space-y-2">
          <span className="inline-flex px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
            Interactive Widget
          </span>
          <h3 className="text-2xl sm:text-3xl font-heading font-medium text-foreground">
            Continuous Vertical Marquee Columns
          </h3>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Columns autoscroll endlessly in alternating vertical directions. Hover to pause and click any video card to play!
          </p>
        </div>
        <VerticalMarqueeSlider data={CANVAS_MARQUEE_DATA} speed={30} pauseOnHover={true} />
      </div>

      {/* 8. Show Packaging Cover Slider (Swiper Coverflow) */}
      <div className="border-t border-primary/5 pt-8">
        <PodcastSlider />
      </div>

      {/* 9. Production Video Swiper (Scale Active Swiper) */}
      <div className="border-t border-primary/5 pt-8">
        <PodcastVideoSwiper videos={CANVAS_PODCAST_VIDEO_SWIPER_DATA} />
      </div>

      {/* 10. Thumbnail Work Portfolio Grid */}
      <div className="border-t border-primary/5 pt-8">
        <ThumbnailWorkSection works={CANVAS_PORTFOLIO_DATA} slug="creative" />
      </div>

      {/* 11. Dual-Row Video & Message Marquee Testimonials */}
      <div className="border-t border-primary/5 pt-8">
        <ServiceTestimonial
          title={CANVAS_TESTIMONIALS_DATA.title}
          description={CANVAS_TESTIMONIALS_DATA.description}
          data={CANVAS_TESTIMONIALS_DATA.data}
        />
      </div>

      {/* 12. Two-Column Accordion FAQ Section */}
      <div className="border-t border-primary/5 pt-8">
        <PageFaqSection />
      </div>

      {/* 13. High-Fidelity Contact Section with Inquiry Form */}
      <div className="border-t border-primary/5 pt-8">
        <PageContactSection />
      </div>

    </main>
  );
}
