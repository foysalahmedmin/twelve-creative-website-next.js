import { WorksCard } from "@/components/cards/works-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { BrandsSection } from "@/components/sections/brands-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { ThumbnailWorkSection } from "@/components/sections/thumbnail-work-section";
import { VerticalMarqueeSlider } from "@/components/sections/vertical-marquee-slider";
import { CTA_WORKS } from "@/data/page-ctas.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { CANVAS_PORTFOLIO_DATA } from "@/data/thumbnail-work-section.data";
import { CANVAS_MARQUEE_DATA } from "@/data/vertical-marquee.data";
import { WORKS_PAGE_MOCK_DATA } from "@/data/works.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work | Twelve Creative Case Studies",
  description:
    "See how Twelve Creative helps businesses improve visibility, trust, campaigns, content, and conversion systems.",
};

export default function WorksPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Work"
        title="Work built around business context."
        description="Our work is not measured by how it looks in isolation. It is measured by whether it helps the business become clearer, more credible, and better equipped to convert attention into action."
      />

      {/* Brands */}
      <BrandsSection />

      {/* Case Studies / Works Grid Section */}
      <section className="border-primary/5 container border-t py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {WORKS_PAGE_MOCK_DATA.map((item, index) => (
            <ScrollReveal
              key={item.id}
              animation="fade-in-up"
              delayMs={index * 150}
              className="flex h-full"
            >
              <WorksCard item={item} className="h-full w-full" />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Vertical marquee — visual asset showcase */}
      <section className="py-16 sm:py-20 lg:py-24">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="Visual Library"
            title="A live look at the work."
            description="Frames from recent hospitality, real estate, aviation, and professional service campaigns. Hover to pause, click any tile to play."
            className="mb-10 lg:mb-12"
          />
        </ScrollReveal>
        <VerticalMarqueeSlider
          data={CANVAS_MARQUEE_DATA}
          speed={30}
          pauseOnHover
        />
      </section>

      {/* Additional work showcase */}
      <ThumbnailWorkSection works={CANVAS_PORTFOLIO_DATA} slug="work" />

      {/* Client voices */}
      <TestimonialSection data={TESTIMONIALS_DATA} />

      {/* CTA */}
      <CTASection data={CTA_WORKS} />
    </main>
  );
}
