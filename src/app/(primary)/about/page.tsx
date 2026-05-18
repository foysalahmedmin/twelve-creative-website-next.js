import { BrandsSection } from "@/components/sections/brands-section";
import { PageContactSection } from "@/components/sections/contact-section-section";
import { FaqSection } from "@/components/sections/faqs-section";
import { GalleryMarqueeSection } from "@/components/sections/gallery-marquee-section";
import { OurMissionSection } from "@/components/sections/our-mission-section";
import { PageHeader } from "@/components/sections/page-header-section";
import { StorySection } from "@/components/sections/story-section";
import { TeamSection } from "@/components/sections/team-section";
import { FAQS_DATA } from "@/data/faqs.data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Twelve Creative",
  description:
    "We are Twelve Creative, a team of cinematic filmmakers, direct-response copywriters, and systems architects.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="We build the bridge between creative and execution."
        description="Learn how Twelve Creative combines high-end production with scalable growth systems."
        breadcrumb={[{ label: "About Us", active: true }]}
      />

      {/* Legacy order: Brands -> Mission -> Story -> Team -> Gallery -> FAQ -> Contact */}

      <div className="pt-8">
        <BrandsSection />
      </div>

      <OurMissionSection />
      <StorySection />
      <TeamSection />
      <GalleryMarqueeSection />

      <div className="container pb-16 lg:pb-24">
        <FaqSection data={FAQS_DATA} />
      </div>

      <PageContactSection />
    </main>
  );
}
