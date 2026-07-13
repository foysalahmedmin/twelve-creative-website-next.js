"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface IServiceItem {
  service_title: string;
  service_description: string;
  image: string;
  title: string;
}

export interface PageServiceSectionProps {
  data: {
    label: string;
    title: string;
    description: string;
    services: IServiceItem[];
  };
  className?: string;
}

export const ServiceServicesSection = ({
  data,
  className,
}: PageServiceSectionProps) => {
  const {
    label,
    title,
    description,
    services = [],
  } = data || {};
  const length = services.length;

  if (length === 0) return null;

  // Reusable Component for Service Card to match old Gradientcard
  const ServiceCard = ({
    service,
    isSecondRow,
  }: {
    service: IServiceItem;
    isSecondRow?: boolean;
  }) => (
    <div
      className={cn("group h-[500px] w-full", isSecondRow ? "col-span-3" : "")}
    >
      <div className="border-border bg-card flex h-full max-h-[482px] w-full max-w-full overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex h-full w-full flex-col p-4">
          <div className="flex-1">
            <h3 className="text-foreground font-heading text-[24px] font-bold tracking-tight">
              {service.service_title}
            </h3>
            <p className="text-muted-foreground mt-2 line-clamp-3 text-[16px] leading-[140%] font-normal">
              {service.service_description}
            </p>
          </div>
          <div className="relative mt-12 h-[276px] w-full overflow-hidden rounded-xl">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrid = () => {
    // Layout 1: 6 or more items
    if (length >= 6) {
      return (
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {services.map((service, idx) => (
            <ScrollReveal key={idx} animation="fade-in-up" delayMs={100 * idx}>
              <ServiceCard service={service} />
            </ScrollReveal>
          ))}
        </div>
      );
    }

    // Layout 2: Exactly 5 items (2 on top, 3 on bottom)
    if (length === 5) {
      return (
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-6 lg:gap-8">
          {services.map((service, idx) => {
            const isSecondRow = idx >= 3;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-in-up"
                delayMs={100 * idx}
                className={cn(isSecondRow ? "lg:col-span-3" : "lg:col-span-2")}
              >
                <ServiceCard service={service} isSecondRow={isSecondRow} />
              </ScrollReveal>
            );
          })}
        </div>
      );
    }

    // Layout 3: Exactly 4 items (Large small configuration)
    if (length === 4) {
      return (
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {services.map((service, idx) => {
            const isSmallCard = idx === 0 || idx === 2;

            return (
              <ScrollReveal
                key={idx}
                animation="fade-in-up"
                delayMs={100 * idx}
                className={cn(isSmallCard ? "lg:col-span-1" : "lg:col-span-2")}
              >
                <div className="border-border bg-card group flex h-[466px] w-full overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.02]">
                  <div className="flex h-[464px] w-full flex-col rounded-2xl p-4">
                    <div className="flex-1">
                      <h2 className="text-foreground text-[24px] font-semibold">
                        {service.service_title}
                      </h2>
                      <p className="text-muted-foreground mt-2 line-clamp-3 text-[16px] leading-[140%]">
                        {service.service_description}
                      </p>
                    </div>
                    <div className="relative mt-6 h-[276px] w-full overflow-hidden rounded-xl">
                      <Image
                        src={service.image}
                        alt={service.title || service.service_title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <section
      className={cn(
        "w-full bg-background border-t border-border/40 py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={label}
            title={title}
            description={description}
            className="mb-10 sm:mb-16"
          />
        </ScrollReveal>
        {renderGrid()}
      </div>
    </section>
  );
};

export default ServiceServicesSection;
