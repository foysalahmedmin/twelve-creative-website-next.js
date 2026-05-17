import { FeatureCard } from "@/components/cards/feature-card";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { cn } from "@/lib/utils";

export const WhyChooseUsSection = ({ className }: { className?: string }) => {
  const featuredId = "systems";

  return (
    <section className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}>
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="Why Twelve Creative"
            title="Why serious operators & founders choose us."
            description="The work is measured by whether the business becomes easier to understand, easier to trust, and easier to buy from."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-10 lg:mt-16">
          {WHY_CHOOSE_US_DATA.map((feature, idx) => (
            <ScrollReveal
              key={feature.id}
              animation="fade-in-up"
              delayMs={150 * (idx % 3)}
              durationMs={800}
              className="h-full"
            >
              <FeatureCard
                feature={feature}
                featured={feature.id === featuredId}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
