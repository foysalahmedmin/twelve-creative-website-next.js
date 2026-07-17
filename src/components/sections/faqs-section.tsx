"use client";

import { Accordion } from "@/components/common/accordion";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { TFaqsData } from "@/data/faqs.data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface FaqsSectionProps {
  data?: TFaqsData;
  className?: string;
}

export const FaqSection = ({ data, className }: FaqsSectionProps) => {
  const {
    is_side_hide,
    image,
    alt,
    title: heading,
    description,
    name,
    position,
    contact_link,
    faqs = [],
  } = data || {};

  return (
    <section
      id="faq"
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="FAQ"
            title="Frequently Asked Questions"
            description="Everything you need to know before we get started."
            className="mb-10 sm:mb-16"
          />
        </ScrollReveal>

        <div
          className={cn(
            "mt-8 grid grid-cols-1 items-start gap-8 lg:mt-16 lg:grid-cols-3",
          )}
        >
          {/* Left Coordinator Profile Card — appears after questions on mobile */}
          <ScrollReveal
            animation="fade-in-up"
            className={cn(
              "order-2 mx-auto w-full max-w-105 lg:sticky lg:top-32 lg:order-1 lg:max-w-full",
              { "hidden lg:col-span-2": is_side_hide },
            )}
          >
            <div className="bg-brand-artefact mx-auto flex h-full w-full max-w-105 rounded-3xl transition-all duration-300 hover:scale-[102%]">
              <div className="flex h-full w-full flex-col items-center space-y-6 rounded-3xl p-8 text-center sm:p-10">
                {/* Profile Image with dual ring */}
                <div className="border-primary-foreground/40 relative size-28 shrink-0 overflow-hidden rounded-full border-2 bg-[#131c20] p-1 dark:border-[#eaeae4]/40">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <Image
                      src={image || "/default-avatar.png"}
                      alt={alt || "Coordinator"}
                      fill
                      sizes="112px"
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="font-heading text-primary-foreground text-xl font-black tracking-tight sm:text-2xl dark:text-[#eaeae4]">
                    {heading}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed sm:text-base dark:text-[#eaeae4]/75">
                    {description}
                  </p>
                </div>

                {/* Coordinator Metadata */}
                <div className="space-y-1">
                  <h4 className="font-heading text-primary-foreground text-lg font-black tracking-tight dark:text-[#eaeae4]">
                    {name}
                  </h4>
                  <p className="text-primary-foreground/75 text-xs font-semibold tracking-wide uppercase sm:text-sm dark:text-[#eaeae4]/70">
                    {position}
                  </p>
                </div>

                {/* Action Button */}
                <Link
                  href={contact_link || "/contact"}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 w-full rounded-lg px-6 py-3 text-center text-sm font-semibold tracking-[0.05em] uppercase transition-all duration-200 select-none hover:scale-105 active:scale-95"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Accordion Questions list — appears first on mobile */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={200}
            className={cn("order-1 w-full lg:order-2 lg:col-span-2", {
              "lg:order-1 lg:col-span-3": is_side_hide,
            })}
          >
            <Accordion items={faqs} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
