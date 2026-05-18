import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { FeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section";
import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { IndustriesSection } from "@/components/_primary_/home-page/industries-section";
import { ServicesSection } from "@/components/_primary_/home-page/services-section";
import { BrandsSection } from "@/components/sections/brands-section";
import FaqSection from "@/components/sections/faqs-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { PROCESS_DATA } from "@/data/process.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twelve Creative — We Build the Structure Behind Growth",
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
};

export default async function HomePage() {
  const testimonialsData = await getPublicTestimonialsForSection({
    label: TESTIMONIALS_DATA.label,
    title: TESTIMONIALS_DATA.title,
    description: TESTIMONIALS_DATA.description,
  });

  return (
    <div className="flex flex-col">
      <HeroSection />
      <BrandsSection />
      <FeaturedProjectsSection />
      <ServicesSection />
      <TestimonialSection data={testimonialsData} />
      <ProcessSection data={PROCESS_DATA} />
      <DifferenceSection />
      <IndustriesSection />
      <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} />
      <FaqSection data={FAQS_DATA} />
      <HomeCtaSection />
    </div>
  );
}
