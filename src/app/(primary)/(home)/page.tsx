import { DifferenceSection } from "@/components/sections/difference-section";
import { FeaturedProjectsSection } from "@/components/sections/featured-projects-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HomeCtaSection } from "@/components/sections/home-cta-section";
import { IndustriesSection } from "@/components/sections/industries-section";
import { BrandsStrip } from "@/components/sections/brands-strip";
import FaqSection from "@/components/sections/faqs-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ScrollStatementSection } from "@/components/sections/scroll-statement-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicFeaturedProjectsGrouped } from "@/lib/api/featured-projects";
import {
  getPublicIndustriesForSection,
  getPublicIndustryOptions,
} from "@/lib/api/industries";
import { getPublicPageCta } from "@/lib/api/page-ctas";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicProcessSection } from "@/lib/api/process-section";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
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
    hero,
    settings,
    industryOptions,
    featuredProjects,
    industries,
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
    getPublicPageHero("home"),
    getPublicSiteSetting(),
    getPublicIndustryOptions(),
    getPublicFeaturedProjectsGrouped(),
    getPublicIndustriesForSection(),
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

  // Same shape the page-header hero uses elsewhere: only override the static
  // hero copy when the CMS actually has a record for this page.
  const heroVideoSrc = resolveVideoSrc(hero?.video);
  const heroPoster = resolveThumbnail(hero?.thumbnail, hero?.video);
  const heroData = hero
    ? {
        title: hero.title ?? "",
        description: hero.description ?? "",
        trust_label: hero.trust_label ?? "",
        primary_cta: hero.primary_cta ?? null,
        secondary_cta: hero.secondary_cta ?? null,
        video:
          heroVideoSrc || heroPoster
            ? { src: heroVideoSrc ?? "", poster: heroPoster }
            : null,
      }
    : undefined;

  return (
    <div className="flex flex-col">
      <HeroSection
        data={heroData}
        calendlyUrl={settings.calendly_url || undefined}
        industries={industryOptions}
      />
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
      <FeaturedProjectsSection
        data={featuredProjects}
        heading={featuredHeading}
      />
      {difference && <DifferenceSection data={difference} className="dark" />}
      <IndustriesSection data={industries} heading={industriesHeading} />
      <FaqSection data={faqsData} heading={faqHeading} />
      {homeCta && <HomeCtaSection data={homeCta} />}
    </div>
  );
}
