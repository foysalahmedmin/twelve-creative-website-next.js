"use client";

import { BookingModal } from "@/components/common/booking-modal";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

interface BookingSectionProps {
  label: string;
  title: string;
  description: string;
  className?: string;
}

const BOOKING_STEPS = [
  {
    id: 1,
    icon: Briefcase01Icon,
    title: "Sector",
    description: "Tell us what industry you operate in.",
  },
  {
    id: 2,
    icon: Calendar01Icon,
    title: "Timeline",
    description: "Pick when you're looking to start.",
  },
  {
    id: 3,
    icon: Clock01Icon,
    title: "Date & Time",
    description: "Choose a date and preferred slot.",
  },
  {
    id: 4,
    icon: UserCircle02Icon,
    title: "Your Details",
    description: "Quick contact info and we're set.",
  },
];

const BOOKING_BENEFITS = [
  "30-minute strategic conversation",
  "No commitment, no pitch deck",
  "Response within 24 hours",
];

export const BookingSection = ({
  label,
  title,
  description,
  className,
}: BookingSectionProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label={label}
          title={title}
          description={description}
          className="mb-10 lg:mb-16"
        />
      </ScrollReveal>

      <ScrollReveal animation="fade-in-up" delayMs={200} durationMs={800}>
        <div className="from-primary/30 to-primary/5 dark:to-primary/3 relative w-full rounded-[28px] bg-linear-to-br p-px lg:rounded-[40px]">
          <div className="bg-card relative overflow-hidden rounded-[27px] p-8 sm:p-10 lg:rounded-[39px] lg:p-12">
            {/* Soft ambient glow */}
            <div
              aria-hidden
              className="bg-primary/12 pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full blur-3xl"
            />
            <div
              aria-hidden
              className="bg-primary/8 pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-3xl"
            />

            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Left: Steps preview */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-primary text-xs font-bold tracking-widest uppercase">
                    4-Step Booking
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                    A quick path from interest to conversation.
                  </h3>
                </div>

                <div className="space-y-3">
                  {BOOKING_STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="border-border/60 bg-background/50 flex items-start gap-4 rounded-2xl border p-4 backdrop-blur-sm"
                    >
                      <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                        <HugeiconsIcon icon={step.icon} className="size-5" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-primary/60 text-xs font-bold tracking-widest">
                            STEP {step.id}
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
              </div>

              {/* Right: CTA card */}
              <div className="flex flex-col justify-center">
                <div className="from-primary-from/10 to-primary-to/5 border-primary/20 space-y-6 rounded-3xl border bg-linear-to-br p-8 backdrop-blur-sm sm:p-10">
                  <div className="space-y-3">
                    <div className="bg-primary text-primary-foreground inline-flex size-12 items-center justify-center rounded-2xl shadow-md">
                      <HugeiconsIcon icon={Calendar01Icon} className="size-6" />
                    </div>
                    <h3 className="font-heading text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
                      Book a 30-minute call.
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      Skip the form. Pick a sector, share your timeline and a
                      preferred slot — we&rsquo;ll reach out within 24 hours.
                    </p>
                  </div>

                  <ul className="space-y-2.5">
                    {BOOKING_BENEFITS.map((benefit) => (
                      <li
                        key={benefit}
                        className="text-foreground/80 flex items-start gap-2.5 text-sm font-medium"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="text-primary mt-0.5 size-4 shrink-0"
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    type="button"
                    onClick={() => setIsBookingOpen(true)}
                    className="from-primary-from to-primary-to hover:shadow-primary group/cta h-14 w-full rounded-2xl bg-linear-to-br text-base font-semibold shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Booking
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-5 transition-transform group-hover/cta:translate-x-1"
                    />
                  </Button>

                  <p className="text-muted-foreground text-center text-xs">
                    Or send a detailed inquiry using the form above.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Modal — same custom flow used in the header */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </section>
  );
};
