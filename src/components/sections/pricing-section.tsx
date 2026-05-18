"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
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
    label: string;
    title: string;
    description: string;
    packages: IPackage[];
  };
  className?: string;
}

export const PricingSection = ({ pricing, className }: PagePricingProps) => {
  const {
    packages = [],
    description,
    title,
    label,
  } = pricing || {};

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label={label}
          title={title}
          description={description}
          className="mb-10 sm:mb-16"
        />
      </ScrollReveal>

      <div className="mt-8 grid grid-cols-1 items-stretch gap-8 md:grid-cols-3 lg:mt-16">
        {packages.map((pkg, idx) => (
          <ScrollReveal
            key={idx}
            animation="fade-in-up"
            delayMs={150 * idx}
            className="flex h-full"
          >
            {/* 1px Gradient outer border card wrapper */}
            <div className="from-primary/45 to-primary/5 dark:to-primary/2 mx-auto flex h-full max-h-[716px] w-full max-w-[398px] rounded-3xl bg-gradient-to-br p-[1px] transition-all duration-300 hover:scale-[102%]">
              <div className="bg-card relative flex h-full w-full flex-col justify-between rounded-[23px] p-6 sm:p-8">
                {/* Package details */}
                <div className="space-y-4">
                  <h3 className="font-heading text-foreground text-2xl font-medium tracking-tight">
                    {pkg.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {pkg.description}
                  </p>

                  {/* Price breakdown */}
                  <div className="flex items-baseline gap-1.5 pt-4">
                    <span className="text-foreground font-heading text-5xl font-medium tracking-tight sm:text-6xl">
                      ${pkg.price}
                    </span>
                    <span className="text-muted-foreground text-sm font-semibold sm:text-base">
                      /{pkg.billing_cycle}
                    </span>
                  </div>
                </div>

                {/* Features List & Button */}
                <div className="mt-8 space-y-8">
                  <ul className="space-y-3.5">
                    {pkg.features?.map((feat, i) => (
                      <li
                        key={i}
                        className="text-foreground/90 flex items-start gap-3 text-sm font-medium sm:text-base"
                      >
                        <span className="border-primary/30 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border">
                          <svg
                            className="size-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                        <span>{feat.feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="bg-primary w-full rounded-2xl px-6 py-4 font-semibold tracking-wide text-white transition-transform duration-200 select-none hover:scale-105 active:scale-95">
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

export default PricingSection;
