import { CTASection } from "@/components/sections/cta-section";
import { IndustriesDetailSection } from "@/components/sections/industries-detail-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { INDUSTRIES_DATA } from "@/data/industries.data";
import { CTA_INDUSTRIES } from "@/data/page-ctas.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicIndustriesAsLegacy } from "@/lib/api/industries";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Industries | Hospitality, Real Estate, Aviation & Professional Services",
  description:
    "Twelve Creative works with hospitality, real estate, aviation, and professional service businesses that need stronger marketing structure.",
};

export default async function IndustriesPage() {
  const [testimonialsData, liveIndustries] = await Promise.all([
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
    getPublicIndustriesAsLegacy(),
  ]);

  const industries = liveIndustries.length ? liveIndustries : INDUSTRIES_DATA;

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Industries"
        title="Built for businesses where trust, presentation, and follow-up matter."
        description="Twelve Creative works across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
      />

      {/* Each industry in depth */}
      <IndustriesDetailSection data={industries} />

      {/* Client voices from these industries */}
      <TestimonialSection data={testimonialsData} />

      {/* CTA */}
      <CTASection data={CTA_INDUSTRIES} />
    </main>
  );
}
