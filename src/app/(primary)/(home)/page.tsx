import { DifferenceSection } from "@/components/_primary_/home-page/difference-section";
import { LiveFeaturedProjectsSection } from "@/components/_primary_/home-page/featured-projects-section-live";
import { LiveHeroSection } from "@/components/_primary_/home-page/hero-section-live";
import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { LiveIndustriesSection } from "@/components/_primary_/home-page/industries-section-live";
import { LiveServicesSection } from "@/components/_primary_/home-page/services-section-live";
import { BrandsStrip } from "@/components/sections/brands-strip";
import FaqSection from "@/components/sections/faqs-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ScrollStatementSection } from "@/components/sections/scroll-statement-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicPageCta } from "@/lib/api/page-ctas";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicPageHero, resolvePageMetadata } from "@/lib/api/page-heroes";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("home");
  const metadata = resolvePageMetadata(hero, {
    title: "Twelve Creative — We Build the Structure Behind Growth",
    description: SITE.description,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      url: hero?.seo?.canonical_url || SITE.url,
      images: hero?.seo?.og_image
        ? [{ url: hero.seo.og_image }]
        : [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
  };
}

export default async function HomePage() {
  const [
    testimonialsData,
    faqsData,
    settings,
    processData,
    homeCta,
    [
      statement,
      featuredHeading,
      servicesHeading,
      testimonialsHeading,
      difference,
      industriesHeading,
      whyChooseUs,
      faqHeading,
    ],
  ] = await Promise.all([
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
    getPublicSiteSetting(),
    getPublicProcessSection(),
    getPublicPageCta("home"),
    getPublicSharedSections([
      "scroll-statement",
      "home-featured-projects",
      "home-services",
      "testimonials",
      "difference",
      "home-industries",
      "why-choose-us",
      "faq",
    ]),
  ]);

  return (
    <div className="flex flex-col">
      <LiveHeroSection />
      <BrandsStrip />
      {statement && <ScrollStatementSection data={statement} />}
      <LiveFeaturedProjectsSection heading={featuredHeading} />
      <LiveServicesSection heading={servicesHeading} />
      <TestimonialSection
        data={testimonialsData}
        heading={testimonialsHeading}
      />
      <ProcessSection
        data={processData}
        processThumbnail={processData.thumbnail}
      />
      {difference && (
        <DifferenceSection
          data={difference}
          howWeStructureImage={settings.how_we_structure_image || undefined}
        />
      )}
      <LiveIndustriesSection heading={industriesHeading} />
      {whyChooseUs && <WhyChooseUsSection cmsData={whyChooseUs} tone="brand" />}
      <FaqSection data={faqsData} heading={faqHeading} />
      {homeCta && <HomeCtaSection data={homeCta} />}
    </div>
  );
}
