import { FeatureCard } from "@/components/cards/feature-card";
import { SectionHeader } from "@/components/common/section-header";
import { WHY_CHOOSE_US_DATA } from "@/data/why-choose-us.data";
import { cn } from "@/lib/utils";

export const WhyChooseUsSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("bg-muted/40 py-16 sm:py-20 lg:py-28", className)}
    >
      <div className="container">
        <SectionHeader
          label="Why Twelve Creative"
          title="Built for businesses with real ambition and operational complexity."
          description="The work is measured by whether the business becomes easier to understand, easier to trust, and easier to buy from."
          align="center"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US_DATA.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
