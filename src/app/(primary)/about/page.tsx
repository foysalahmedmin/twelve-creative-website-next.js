import { PageHeader } from "@/components/sections/page-header-section";
import { BrandsSection } from "@/components/_primary_/home-page/brands-section";
import { AboutMission } from "@/components/sections/about-mission";
import { AboutStory } from "@/components/sections/about-story";
import { AboutTeam } from "@/components/sections/about-team";
import { AboutGalleryMarquee } from "@/components/sections/about-gallery-marquee";
import { PageFaqSection } from "@/components/sections/page-faq-section";
import { PageContactSection } from "@/components/sections/page-contact-section";
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

      <AboutMission />
      <AboutStory />
      <AboutTeam />
      <AboutGalleryMarquee />
      
      <div className="container pb-16 lg:pb-24">
        <PageFaqSection />
      </div>

      <PageContactSection />
    </main>
  );
}
