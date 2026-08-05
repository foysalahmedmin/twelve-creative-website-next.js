import { ServiceCard } from "@/components/cards/service-card";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { SERVICES_DATA, type TService } from "@/data/services.data";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  data?: TService[];
  heading?: HeadingSection | null;
}

export const ServicesSection = ({ className, data, heading }: Props) => {
  const services = data && data.length ? data : SERVICES_DATA;
  return (
    <section
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        {/* Header */}
        {heading !== null && (
          <ScrollReveal animation="fade-in-up" durationMs={800}>
            <CenteredSectionHeader
              label={heading?.label ?? "Our Services"}
              title={heading?.title ?? "Services Built to Move the Business"}
              description={
                heading?.description ??
                "We help businesses build positioning, creative, and systems that turn attention into revenue."
              }
              className="mb-0 lg:mb-0"
            />
          </ScrollReveal>
        )}

        {/* Grid */}
        <div
          className={cn(
            "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3",
            heading === null ? "mt-0" : "mt-10 lg:mt-20",
          )}
        >
          {services.map((service, idx) => (
            <ScrollReveal
              key={service.id}
              animation="fade-in-up"
              delayMs={150 * (idx % 3)}
            >
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
