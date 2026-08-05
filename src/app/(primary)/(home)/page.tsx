import { DifferenceSection } from "@/components/sections/difference-section";
import { LiveFeaturedProjectsSection } from "@/components/sections/featured-projects-section-live";
import { LiveHeroSection } from "@/components/sections/hero-section-live";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { LiveIndustriesSection } from "@/components/sections/industries-section-live";
import { BrandsStrip } from "@/components/sections/brands-strip";
import FaqSection from "@/components/sections/faqs-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ScrollStatementSection } from "@/components/sections/scroll-statement-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicPageCta } from "@/lib/api/page-ctas";
import { getPublicPageHero, resolvePageMetadata } from "@/lib/api/page-heroes";
import { getPublicProcessSection } from "@/lib/api/process-section";
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
    processData,
    homeCta,
    [
      statement,
      featuredHeading,
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
    getPublicProcessSection(),
    getPublicPageCta("home"),
    getPublicSharedSections([
      "scroll-statement",
      "home-featured-projects",
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
      <ProcessSection
        data={processData}
        processThumbnail={processData.thumbnail}
      />
      <TestimonialSection
        data={testimonialsData}
        heading={testimonialsHeading}
      />
      <LiveFeaturedProjectsSection heading={featuredHeading} />
      {difference && <DifferenceSection data={difference} className="dark" />}
      <LiveIndustriesSection heading={industriesHeading} />
      <FaqSection data={faqsData} heading={faqHeading} />
      {homeCta && <HomeCtaSection data={homeCta} />}
    </div>
  );
}
