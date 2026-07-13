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
  calendlyUrl?: string;
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
  calendlyUrl,
}: BookingSectionProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
          className="mb-10 lg:mb-16"
        />
      </ScrollReveal>

      <ScrollReveal animation="fade-in-up" delayMs={200} durationMs={800}>
        <div className="border-border bg-card relative w-full overflow-hidden rounded-3xl border">
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Left: Steps preview */}
              <ScrollReveal animation="fade-in-left" durationMs={750} className="space-y-6">
                <div className="space-y-3">
                  <span className="border-foreground/25 text-foreground inline-block rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                    4-Step Booking
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-black tracking-tight leading-tight sm:text-3xl">
                    A quick path from interest to conversation.
                  </h3>
                </div>

                <div className="space-y-3">
                  {BOOKING_STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="border-border bg-background flex items-start gap-4 rounded-2xl border p-4"
                    >
                      <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg">
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
              </ScrollReveal>

              {/* Right: CTA card */}
              <ScrollReveal animation="fade-in-right" delayMs={150} durationMs={750} className="flex flex-col justify-center">
                <div className="bg-brand-artefact relative space-y-6 overflow-hidden rounded-3xl p-8 sm:p-10">
                  <div className="relative space-y-3">
                    <div className="bg-primary text-primary-foreground inline-flex size-12 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={Calendar01Icon} className="size-6" />
                    </div>
                    <h3 className="font-heading text-[#eaeae4] text-2xl font-black tracking-tight leading-tight sm:text-3xl">
                      Book a 30-minute call.
                    </h3>
                    <p className="text-[#eaeae4]/75 text-sm leading-relaxed sm:text-base">
                      Skip the form. Pick a sector, share your timeline and a
                      preferred slot — we&rsquo;ll reach out within 24 hours.
                    </p>
                  </div>

                  <ul className="relative space-y-2.5">
                    {BOOKING_BENEFITS.map((benefit) => (
                      <li
                        key={benefit}
                        className="text-[#eaeae4]/85 flex items-start gap-2.5 text-sm font-medium"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="text-primary mt-0.5 size-4 shrink-0"
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
                      className="bg-primary text-primary-foreground group/cta relative inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg text-base font-semibold uppercase tracking-[0.05em] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Start Booking
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
                      className="group/cta relative h-14 w-full"
                    >
                      Start Booking
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-5 transition-transform group-hover/cta:translate-x-1"
                      />
                    </Button>
                  )}

                  <p className="text-[#eaeae4]/60 relative text-center text-xs">
                    Or send a detailed inquiry using the form above.
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
          />
        )}
      </div>
    </section>
  );
};
