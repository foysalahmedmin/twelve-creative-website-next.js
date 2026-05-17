"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
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
    tag: string;
    heading_part1: string;
    heading_part2?: string;
    paragraph: string;
    services: IServiceItem[];
  };
  className?: string;
}

export const PageServiceSection = ({ data, className }: PageServiceSectionProps) => {
  const { tag, heading_part1, heading_part2, paragraph, services = [] } = data || {};
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
    <div className={cn("group w-full h-[500px]", isSecondRow ? "col-span-3" : "")}>
      <div className="w-full max-w-full max-h-[482px] h-full rounded-[24px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 p-[1px] flex transition-transform duration-300 hover:scale-[1.02] overflow-hidden">
        <div className="w-full max-h-[480px] h-full rounded-[23px] bg-card dark:bg-card/95 flex flex-col p-4">
          <div className="flex-1">
            <h3 className="text-[24px] font-semibold text-foreground">{service.service_title}</h3>
            <p className="text-[16px] font-normal leading-[140%] text-muted-foreground mt-2 line-clamp-3">
              {service.service_description}
            </p>
          </div>
          <div className="relative w-full h-[276px] mt-12 overflow-hidden rounded-[13.5px]">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
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
        <div className="mt-10 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
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
        <div className="mt-10 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-8">
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
        <div className="mt-10 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {services.map((service, idx) => {
            const isSmallCard = idx === 0 || idx === 2;

            return (
              <ScrollReveal
                key={idx}
                animation="fade-in-up"
                delayMs={100 * idx}
                className={cn(isSmallCard ? "lg:col-span-1" : "lg:col-span-2")}
              >
                <div className="w-full h-[466px] rounded-[24px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 p-[1px] flex transition-transform duration-300 hover:scale-[1.02] overflow-hidden group">
                  <div className="w-full h-[464px] rounded-[23px] bg-card dark:bg-card/95 flex flex-col p-4">
                    <div className="flex-1">
                      <h2 className="text-[24px] font-semibold text-foreground">
                        {service.service_title}
                      </h2>
                      <p className="mt-2 text-[16px] leading-[140%] text-muted-foreground line-clamp-3">
                        {service.service_description}
                      </p>
                    </div>
                    <div className="relative w-full h-[276px] mt-6 overflow-hidden rounded-[13.5px]">
                      <Image
                        src={service.image}
                        alt={service.title || service.service_title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
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
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label={tag}
          title={heading_part2 ? `${heading_part1} ${heading_part2}` : heading_part1}
          description={paragraph}
          className="mb-10 sm:mb-16"
        />
      </ScrollReveal>
      {renderGrid()}
    </section>
  );
};

export default PageServiceSection;
