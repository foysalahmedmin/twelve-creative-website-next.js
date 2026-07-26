import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import {
  VerticalMarqueeSlider,
  type MarqueeItem,
} from "@/components/sections/vertical-marquee-slider";
import type { HeadingSection } from "@/lib/api/shared-sections";

interface IndustryVisualLibrarySectionProps {
  industryName: string;
  videos: MarqueeItem[];
  heading?: HeadingSection | null;
}

export function IndustryVisualLibrarySection({
  industryName,
  videos,
  heading,
}: IndustryVisualLibrarySectionProps) {
  if (!videos.length) return null;

  return (
    <section className="w-full border-y border-white/10 bg-[#131C20] py-16 text-[#EAEAE4] sm:py-20 lg:py-24">
      {heading !== null && (
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={heading?.label ?? "Visual Library"}
            title={heading?.title ?? "A live look at the work."}
            description={
              heading?.description
                ? heading.description.replaceAll(
                    "{industry}",
                    industryName.toLowerCase(),
                  )
                : `Frames from recent ${industryName.toLowerCase()} campaigns — content, ads, and brand assets built to perform.`
            }
            tone="inverse"
            className="mb-10 lg:mb-12"
          />
        </ScrollReveal>
      )}

      <VerticalMarqueeSlider data={videos} speed={30} pauseOnHover />
    </section>
  );
}
