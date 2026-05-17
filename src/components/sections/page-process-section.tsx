"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface IProcessStep {
  icon: string;
  alt: string;
  title: string;
  description: string;
  image: string;
}

export interface PageProcessSectionProps {
  data: {
    tag: string;
    heading_part1: string;
    heading_part2?: string;
    paragraph: string;
    image: string;
    process_steps: IProcessStep[];
  };
  interactive?: boolean;
  className?: string;
}

export const PageProcessSection = ({ data, interactive = true, className }: PageProcessSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { tag, heading_part1, heading_part2, paragraph, process_steps = [] } = data || {};

  useEffect(() => {
    if (!interactive) return;

    const handleScroll = () => {
      const cards = document.querySelectorAll(".process-story-card");
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // Check if card is in vertical center region
        if (
          rect.top < window.innerHeight / 2 &&
          rect.bottom > window.innerHeight / 2
        ) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [interactive]);

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

      {/* Steps Content Grid */}
      <div className="flex flex-col lg:flex-row items-stretch gap-12 mt-8 lg:mt-16 relative">
        
        {/* Left Sticky Image Panel */}
        <div
          className="flex-1 flex sticky top-32 self-start rounded-[32px] overflow-hidden border border-primary/10 aspect-[4/3] sm:aspect-square lg:aspect-auto lg:h-[520px] z-10"
        >
          <Image
            src={process_steps[activeIndex]?.image || data.image}
            alt="Process Execution Step"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-700 ease-in-out scale-100 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Content Steps List */}
        <div className="flex-1 flex flex-col gap-4 justify-start">
          {process_steps.map((step, idx) => {
            const isActive = activeIndex === idx;

            return (
              <div
                key={idx}
                className="process-story-card"
                onClick={() => setActiveIndex(idx)}
              >
                <div
                  className={cn(
                    "w-full rounded-[24px] bg-gradient-to-br p-[1px] cursor-pointer transition-all duration-300",
                    isActive
                      ? "from-primary/45 to-primary/5 dark:to-primary/2 hover:scale-[102%]"
                      : "from-primary/10 to-transparent hover:from-primary/25"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-[23px] bg-card p-5 sm:p-6 flex items-start gap-4 transition-all duration-300",
                      isActive ? "bg-gradient-to-b from-white to-primary/5 dark:from-background dark:to-primary/10" : ""
                    )}
                  >
                    {/* Step Icon */}
                    <div className="size-14 relative shrink-0 rounded-2xl overflow-hidden border border-primary/10 p-2.5 bg-background">
                      <img
                        src={step.icon}
                        alt={step.alt || "icon"}
                        className="w-full h-full object-contain filter dark:invert"
                      />
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground line-clamp-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PageProcessSection;
