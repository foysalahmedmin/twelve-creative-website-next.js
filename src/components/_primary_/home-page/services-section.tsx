import { ServiceCard } from "@/components/cards/service-card";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { SERVICES_DATA } from "@/data/services.data";
import { cn } from "@/lib/utils";

export const ServicesSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "container py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      {/* Header */}
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label="Our Services"
          title="Services Built to Move the Business"
          description="We help businesses build positioning, creative, and systems that turn attention into revenue."
          className="mb-0 lg:mb-0"
        />
      </ScrollReveal>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {SERVICES_DATA.map((service, idx) => (
          <ScrollReveal key={service.id} animation="fade-in-up" delayMs={150 * (idx % 3)}>
            <ServiceCard service={service} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
