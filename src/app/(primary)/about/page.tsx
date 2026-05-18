import { BrandsSection } from "@/components/sections/brands-section";
import { CTASection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { GalleryMarqueeSection } from "@/components/sections/gallery-marquee-section";
import { OurMissionSection } from "@/components/sections/our-mission-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { StorySection } from "@/components/sections/story-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FAQS_DATA } from "@/data/faqs.data";
import { CTA_ABOUT } from "@/data/page-ctas.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Twelve Creative | Strategy, Creative & Systems",
  description:
    "Twelve Creative was built from the belief that creative work should be connected to the business it serves. Led by Carlos Doce.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="About"
        title="Built for businesses that need strategy and execution in the same room."
        description="Twelve Creative was built from the belief that creative work should be connected to the business it serves. We exist to close the gap between strategy and execution."
      />

      {/* Brands we've worked with */}
      <BrandsSection />

      {/* Mission & Vision */}
      <OurMissionSection />

      {/* Story timeline */}
      <StorySection />

      {/* Team */}
      <TeamSection />

      {/* Behind the scenes gallery */}
      <GalleryMarqueeSection />

      {/* Client voices */}
      <TestimonialSection data={TESTIMONIALS_DATA} />

      {/* FAQ */}
      <div className="container py-8 lg:py-12">
        <FaqSection data={FAQS_DATA} />
      </div>

      {/* CTA */}
      <CTASection data={CTA_ABOUT} />
    </main>
  );
}
