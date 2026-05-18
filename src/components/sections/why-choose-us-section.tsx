import { FeatureCard } from "@/components/cards/feature-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { TWhyChooseUsData } from "@/data/why-choose-us.data";
import { cn } from "@/lib/utils";

export interface PageWhyChooseUsProps {
  data: TWhyChooseUsData;
  className?: string;
}

export const WhyChooseUsSection = ({
  data,
  className,
}: PageWhyChooseUsProps) => {
  const {
    label: tag,
    title: heading_part1,
    description: paragraph,
    features: whychooseus_items = [],
  } = data || {};

  return (
    <section className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}>
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={tag}
            title={heading_part1}
            description={paragraph}
          />
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {whychooseus_items.map((feature, idx) => (
            <ScrollReveal
              key={feature.id}
              animation="fade-in-up"
              delayMs={150 * (idx % 3)}
              durationMs={800}
              className="h-full"
            >
              <FeatureCard feature={feature} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
