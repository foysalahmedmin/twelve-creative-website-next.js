import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { LiveFeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section-live";
import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { LiveHeroSection } from "@/components/_primary_/home-page/hero-section-live";
import { LiveIndustriesSection } from "@/components/_primary_/home-page/industries-section-live";
import { LiveServicesSection } from "@/components/_primary_/home-page/services-section-live";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { CoreVerticalsSection } from "@/components/sections/core-verticals-section";
import FaqSection from "@/components/sections/faqs-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { PROCESS_DATA } from "@/data/process.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicIndustries } from "@/lib/api/industries";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
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
  const [testimonialsData, faqsData, industries, settings] = await Promise.all([
    getPublicTestimonialsForSection({
      label: TESTIMONIALS_DATA.label,
      title: TESTIMONIALS_DATA.title,
      description: TESTIMONIALS_DATA.description,
    }),
    getPublicFaqsForSection({
      image: FAQS_DATA.image,
      alt: FAQS_DATA.alt,
      title: FAQS_DATA.title,
      description: FAQS_DATA.description,
      name: FAQS_DATA.name,
      position: FAQS_DATA.position,
      contact_link: FAQS_DATA.contact_link,
    }),
    getPublicIndustries(),
    getPublicSiteSetting(),
  ]);

  return (
    <div className="flex flex-col">
      <LiveHeroSection />
      <BrandsStrip />
      <CoreVerticalsSection industries={industries} />
      <LiveFeaturedProjectsSection />
      <LiveServicesSection />
      <TestimonialSection data={testimonialsData} />
      <ProcessSection data={PROCESS_DATA} processThumbnail={settings.process_thumbnail || undefined} />
      <DifferenceSection howWeStructureImage={settings.how_we_structure_image || undefined} />
      <LiveIndustriesSection />
      <WhyChooseUsSection data={WHY_CHOOSE_US_DATA} />
      <FaqSection data={faqsData} />
      <HomeCtaSection />
    </div>
  );
}
