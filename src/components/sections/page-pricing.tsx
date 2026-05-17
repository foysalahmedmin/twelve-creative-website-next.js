"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";

export interface IPackageFeature {
  feature: string;
}

export interface IPackage {
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: IPackageFeature[];
}

export interface PagePricingProps {
  pricing: {
    heading_part1: string;
    heading_part2?: string;
    tag: string;
    paragraph: string;
    packages: IPackage[];
  };
  className?: string;
}

export const PagePricing = ({ pricing, className }: PagePricingProps) => {
  const { packages = [], paragraph, heading_part1, heading_part2, tag } = pricing || {};

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mt-8 lg:mt-16">
        {packages.map((pkg, idx) => (
          <ScrollReveal
            key={idx}
            animation="fade-in-up"
            delayMs={150 * idx}
            className="h-full flex"
          >
            {/* 1px Gradient outer border card wrapper */}
            <div className="w-full h-full max-w-[398px] max-h-[716px] mx-auto rounded-3xl bg-gradient-to-br from-primary/45 to-primary/5 dark:to-primary/2 p-[1px] flex transition-all duration-300 hover:scale-[102%]">
              <div className="relative rounded-[23px] bg-card w-full h-full flex flex-col justify-between p-6 sm:p-8">
                {/* Package details */}
                <div className="space-y-4">
                  <h3 className="font-heading font-medium text-2xl tracking-tight text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  {/* Price breakdown */}
                  <div className="flex items-baseline gap-1.5 pt-4">
                    <span className="text-foreground text-5xl sm:text-6xl font-heading font-medium tracking-tight">
                      ${pkg.price}
                    </span>
                    <span className="text-muted-foreground text-sm sm:text-base font-semibold">
                      /{pkg.billing_cycle}
                    </span>
                  </div>
                </div>

                {/* Features List & Button */}
                <div className="space-y-8 mt-8">
                  <ul className="space-y-3.5">
                    {pkg.features?.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm sm:text-base font-medium text-foreground/90">
                        <span className="flex items-center justify-center size-5 rounded-full border border-primary/30 text-primary shrink-0 mt-0.5">
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span>{feat.feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-semibold tracking-wide hover:scale-105 active:scale-95 duration-200 transition-transform select-none">
                    Start a Conversation
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default PagePricing;
