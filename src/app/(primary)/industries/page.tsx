import { IndustriesSection } from "@/components/_primary_/home-page/industries-section";
import { AlternatingServicesSection } from "@/components/sections/alternating-services-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { INDUSTRIES_DATA } from "@/data/industries.data";
import { CTA_INDUSTRIES } from "@/data/page-ctas.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Industries | Hospitality, Real Estate, Aviation & Professional Services",
  description:
    "Twelve Creative works with hospitality, real estate, aviation, and professional service businesses that need stronger marketing structure.",
};

const INDUSTRY_ITEMS = INDUSTRIES_DATA.map((industry) => ({
  id: industry.id,
  title: industry.headline,
  description: industry.description,
  highlights: industry.work,
  thumbnail_src: industry.image,
}));

export default function IndustriesPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Industries"
        title="Built for businesses where trust, presentation, and follow-up matter."
        description="Twelve Creative works across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
      />

      {/* Tabbed industries overview */}
      <IndustriesSection />

      {/* Each industry in depth */}
      <AlternatingServicesSection data={INDUSTRY_ITEMS} />

      {/* Client voices from these industries */}
      <TestimonialSection data={TESTIMONIALS_DATA} />

      {/* CTA */}
      <CTASection data={CTA_INDUSTRIES} />
    </main>
  );
}
