"use client";

import { CmsMediaDisplay } from "@/components/common/cms-media-display";
import { CenteredSectionHeader } from "@/components/common/section-label";
import type {
  AboutGalleryItem,
  AboutSectionHeader,
} from "@/lib/api/about-page";
import Marquee from "react-fast-marquee";

interface GalleryMarqueeSectionProps {
  section: AboutSectionHeader | null;
  items: AboutGalleryItem[];
}

export function GalleryMarqueeSection({
  section,
  items,
}: GalleryMarqueeSectionProps) {
  const visibleItems = items.filter((item) => item.is_visible);
  if (!section?.is_visible || visibleItems.length === 0) return null;

  return (
    <section className="overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container mb-10 sm:mb-14">
        <CenteredSectionHeader
          label={section.label}
          title={section.title}
          description={section.description}
        />
      </div>
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Row 1 - Left to Right */}
        <Marquee speed={40} gradient={false} direction="left">
          <div className="flex gap-4 pr-4 sm:gap-6 sm:pr-6">
            {visibleItems.map((item) => (
              <div
                key={`row1-${item.id}`}
                className="border-border bg-muted relative aspect-4/3 h-48 overflow-hidden rounded-2xl border sm:h-64 lg:h-80"
              >
                <CmsMediaDisplay
                  media={item.media}
                  alt={item.alt}
                  className="absolute inset-0"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Marquee>

        {/* Row 2 - Right to Left */}
        <Marquee speed={35} gradient={false} direction="right">
          <div className="flex gap-4 pr-4 sm:gap-6 sm:pr-6">
            {[...visibleItems].reverse().map((item) => (
              <div
                key={`row2-${item.id}`}
                className="border-border bg-muted relative aspect-[4/3] h-48 overflow-hidden rounded-2xl border sm:h-64 lg:h-80"
              >
                <CmsMediaDisplay
                  media={item.media}
                  alt={item.alt}
                  className="absolute inset-0"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
