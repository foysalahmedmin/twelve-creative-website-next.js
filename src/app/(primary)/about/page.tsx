import { BrandsStrip } from "@/components/sections/brands-strip";
import { CTASection } from "@/components/sections/cta-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { GalleryMarqueeSection } from "@/components/sections/gallery-marquee-section";
import { OurMissionSection } from "@/components/sections/our-mission-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { StorySection } from "@/components/sections/story-section";
import { FounderSection } from "@/components/sections/founder-section";
import { TestimonialSection } from "@/components/sections/testimonial-section";
import { FAQS_DATA } from "@/data/faqs.data";
import { CTA_ABOUT } from "@/data/page-ctas.data";
import { TESTIMONIALS_DATA } from "@/data/testimonials.data";
import { getPublicFaqsForSection } from "@/lib/api/faqs";
import { getPublicPageHero, resolveVideoSrc, resolveThumbnail } from "@/lib/api/page-heroes";
import { getPublicSiteSetting } from "@/lib/api/site-setting";
import { getPublicTestimonialsForSection } from "@/lib/api/testimonials";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Twelve Creative | Strategy, Creative & Systems",
  description:
    "Twelve Creative was built from the belief that creative work should be connected to the business it serves. Led by Carlos Doce.",
};

export default async function AboutPage() {
  const [testimonialsData, faqsData, hero, settings] = await Promise.all([
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
    getPublicSiteSetting(),
  ]);

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label={hero?.label ?? "About"}
        title={hero?.title ?? "Built for businesses that need strategy and execution in the same room."}
        description={hero?.description ?? "Twelve Creative was built from the belief that creative work should be connected to the business it serves. We exist to close the gap between strategy and execution."}
        videoSrc={resolveVideoSrc(hero?.video)}
        thumbnailSrc={resolveThumbnail(hero?.thumbnail, hero?.video)}
      />

      {/* Brands we've worked with */}
      <BrandsStrip />

      {/* Mission & Vision */}
      <OurMissionSection />

      {/* Story timeline */}
      <StorySection contentSection={settings.content_section} />

      {/* Founder — Carlos Doce */}
      <FounderSection imageSrc={settings.meeting_scene_image || undefined} />

      {/* Behind the scenes gallery */}
      <GalleryMarqueeSection />

      {/* Client voices */}
      <TestimonialSection data={testimonialsData} />

      {/* FAQ */}
      <div className="container py-8 lg:py-12">
        <FaqSection data={faqsData} />
      </div>

      {/* CTA */}
      <CTASection data={CTA_ABOUT} />
    </main>
  );
}
