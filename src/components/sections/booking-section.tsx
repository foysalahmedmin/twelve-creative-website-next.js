"use client";

import { BookingModal } from "@/components/common/booking-modal";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PublicIndustryOption } from "@/lib/api/industries";
import {
  ArrowRight01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { BOOKING_DATA, type TBookingData } from "@/data/booking.data";

interface BookingSectionProps {
  label: string;
  title: string;
  description: string;
  className?: string;
  calendlyUrl?: string;
  industries?: PublicIndustryOption[];
  /** Admin-managed copy + availability. Falls back to BOOKING_DATA. */
  booking?: TBookingData;
}

/**
 * Step icons stay in code: they are part of the visual design rather than
 * copy, and cycle in order so a step added in the admin still gets one.
 */
const STEP_ICONS = [
  Briefcase01Icon,
  Calendar01Icon,
  Clock01Icon,
  UserCircle02Icon,
];

export const BookingSection = ({
  label,
  title,
  description,
  className,
  calendlyUrl,
  industries = [],
  booking = BOOKING_DATA,
}: BookingSectionProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { content } = booking;

  return (
    <section
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={label}
            title={title}
            description={description}
            className="mb-10 lg:mb-16"
          />
        </ScrollReveal>

        <ScrollReveal animation="fade-in-up" delayMs={200} durationMs={800}>
          <div className="border-border bg-card relative w-full overflow-hidden rounded-3xl border">
            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
                {/* Left: Steps preview */}
                <ScrollReveal
                  animation="fade-in-left"
                  durationMs={750}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <span className="border-foreground/25 text-foreground inline-block rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                      {content.label}
                    </span>
                    <h3 className="font-heading text-foreground text-2xl leading-tight font-black tracking-tight sm:text-3xl">
                      {content.title}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {content.steps.map((step, stepIndex) => (
                      <div
                        key={`${step.title}-${stepIndex}`}
                        className="border-border bg-background flex items-start gap-4 rounded-2xl border p-4"
                      >
                        <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
                          <HugeiconsIcon
                            icon={STEP_ICONS[stepIndex % STEP_ICONS.length]}
                            className="size-5"
                          />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-primary/60 text-xs font-bold tracking-widest">
                              STEP {stepIndex + 1}
                            </span>
                            <h4 className="font-heading text-foreground text-base font-semibold">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>

                {/* Right: CTA card */}
                <ScrollReveal
                  animation="fade-in-right"
                  delayMs={150}
                  durationMs={750}
                  className="flex flex-col justify-center"
                >
                  <div className="bg-brand-artefact relative space-y-6 overflow-hidden rounded-3xl p-8 sm:p-10">
                    <div className="relative space-y-3">
                      <div className="bg-primary-foreground text-primary dark:bg-primary dark:text-primary-foreground inline-flex size-12 items-center justify-center rounded-lg">
                        <HugeiconsIcon
                          icon={Calendar01Icon}
                          className="size-6"
                        />
                      </div>
                      <h3 className="font-heading text-primary-foreground text-2xl leading-tight font-black tracking-tight sm:text-3xl dark:text-[#eaeae4]">
                        {content.card_title}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm leading-relaxed sm:text-base dark:text-[#eaeae4]/75">
                        {content.card_description}
                      </p>
                    </div>

                    <ul className="relative space-y-2.5">
                      {content.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="text-primary-foreground/85 flex items-start gap-2.5 text-sm font-medium dark:text-[#eaeae4]/85"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            className="text-primary-foreground dark:text-primary mt-0.5 size-4 shrink-0"
                          />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {calendlyUrl ? (
                      <a
                        href={calendlyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group/cta dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 relative inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold tracking-[0.05em] uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {content.cta_label}
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="size-5 transition-transform group-hover/cta:translate-x-1"
                        />
                      </a>
                    ) : (
                      <Button
                        variant="secondary"
                        size="lg"
                        type="button"
                        onClick={() => setIsBookingOpen(true)}
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group/cta dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary relative h-14 w-full"
                      >
                        {content.cta_label}
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="size-5 transition-transform group-hover/cta:translate-x-1"
                        />
                      </Button>
                    )}

                    <p className="text-primary-foreground/70 relative text-center text-xs dark:text-[#eaeae4]/60">
                      {content.footnote}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {!calendlyUrl && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            industries={industries}
          />
        )}
      </div>
    </section>
  );
};
