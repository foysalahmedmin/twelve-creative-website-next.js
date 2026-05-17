import { BrandsSection } from "@/components/_primary_/home-page/brands-section";
import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { FaqSection } from "@/components/_primary_/home-page/faq-section";
import { FeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section";
import { HeroSection } from "@/components/_primary_/home-page/hero-section";
import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { IndustriesSection } from "@/components/_primary_/home-page/industries-section";
import { ProcessSection } from "@/components/_primary_/home-page/process-section";
import { ServicesSection } from "@/components/_primary_/home-page/services-section";
import { TestimonialSection } from "@/components/_primary_/home-page/testimonial-section";
import { WhyChooseUsSection } from "@/components/_primary_/home-page/why-choose-us-section";
import { SITE } from "@/config/site";
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

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <BrandsSection />
      <FeaturedProjectsSection />
      <ServicesSection />
      <TestimonialSection />
      <ProcessSection />
      <DifferenceSection />
      <IndustriesSection />
      <WhyChooseUsSection />
      <FaqSection />
      <HomeCtaSection />
    </div>
  );
}
