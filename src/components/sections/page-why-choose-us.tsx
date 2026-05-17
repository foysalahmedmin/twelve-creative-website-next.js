"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";

export interface IWhyChooseUsItem {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

export interface PageWhyChooseUsProps {
  data: {
    tag: string;
    heading_part1: string;
    heading_part2?: string;
    paragraph: string;
    whychooseus_items: IWhyChooseUsItem[];
  };
  className?: string;
}

export const PageWhyChooseUs = ({ data, className }: PageWhyChooseUsProps) => {
  const { tag, heading_part1, heading_part2, paragraph, whychooseus_items = [] } = data || {};

  if (whychooseus_items.length === 0) return null;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 lg:mt-16">
        {whychooseus_items.map((item, idx) => (
          <ScrollReveal
            key={idx}
            animation="fade-in-up"
            delayMs={150 * idx}
            className="flex h-full"
          >
            {/* outer border wrapper */}
            <div className="w-full h-full max-w-[394px] mx-auto md:max-h-[214px] max-h-[230px] rounded-[24px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 p-[1px] flex transition-all duration-300 hover:scale-105">
              <div className="rounded-[23px] bg-card w-full h-full flex flex-col justify-start md:py-6 py-4 md:px-5 px-4 space-y-4">
                
                {/* Icon Wrapper */}
                <div className="size-10 shrink-0 relative rounded-xl overflow-hidden p-1.5 flex items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.alt || "icon"}
                    className="w-full h-full object-contain filter dark:invert"
                  />
                </div>

                {/* Info Text */}
                <div className="space-y-1.5 flex flex-col items-start gap-1">
                  <h3 className="font-heading font-semibold text-[22px] leading-[100%] md:text-[24px] text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-[14px] md:text-[16px] leading-[140%] line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default PageWhyChooseUs;
