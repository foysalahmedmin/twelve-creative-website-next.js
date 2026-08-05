import { BrandsStrip } from "@/components/sections/brands-strip";
import { CTAV1Section } from "@/components/sections/cta-v1-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { FounderSection } from "@/components/sections/founder-section";
import { GalleryMarqueeSection } from "@/components/sections/gallery-marquee-section";
import { HeroV1Section } from "@/components/sections/hero-v1-section";
import { OurMissionSection } from "@/components/sections/our-mission-section";
import { StorySection } from "@/components/sections/story-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FAQS_DATA } from "@/data/faqs.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicAboutPage } from "@/lib/api/about-page";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicPageCta, toLegacyPageCta } from "@/lib/api/page-ctas";
import {
  getPublicPageHero,
  resolvePageMetadata,
  resolveThumbnail,
  resolveVideoSrc,
} from "@/lib/api/page-heroes";
import { getPublicSharedSections } from "@/lib/api/shared-sections";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPublicPageHero("about");
  return resolvePageMetadata(hero, {
    title: "About Twelve Creative | Strategy, Creative & Systems",
    description:
      "Twelve Creative was built from the belief that creative work should be connected to the business it serves. Led by Carlos Doce.",
  });
}

export default async function AboutPage() {
  const [
    testimonialsData,
    faqsData,
    hero,
    about,
    [testimonialsHeading, faqHeading],
    pageCta,
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
    getPublicPageHero("about"),
    getPublicAboutPage(),
    getPublicSharedSections(["testimonials", "faq"]),
    getPublicPageCta("about"),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <HeroV1Section
        label={hero?.label ?? "About"}
        title={
          hero?.title ??
          "Built for businesses that need strategy and execution in the same room."
        }
        description={
          hero?.description ??
          "Twelve Creative was built from the belief that creative work should be connected to the business it serves. We exist to close the gap between strategy and execution."
        }
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Brands we've worked with */}
      <BrandsStrip />

      {about && (
        <>
          {/* Mission & Vision */}
          <OurMissionSection
            section={about.mission_section}
            mission={about.mission}
            vision={about.vision}
          />

          {/* Story timeline */}
          <StorySection
            section={about.story_section}
            cards={about.story_cards}
          />

          {/* Founder — Carlos Doce */}
          {about.founder && <FounderSection founder={about.founder} />}

          {/* Behind the scenes gallery */}
          <GalleryMarqueeSection
            section={about.gallery_section}
            items={about.gallery}
          />
        </>
      )}

      {/* Client voices */}
      <TestimonialSection
        data={testimonialsData}
        heading={testimonialsHeading}
      />

      {/* FAQ */}
      <div className="container py-8 lg:py-12">
        <FaqSection
          data={{ ...faqsData, is_side_hide: true }}
          heading={faqHeading}
        />
      </div>

      {/* CTA */}
      {pageCta && <CTAV1Section data={toLegacyPageCta(pageCta)} />}
    </main>
  );
}
