import { ScrollReveal } from "@/components/common/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed | Twelve Creative",
  description:
    "Thanks for reaching out — your call request has been received. Our team will be in touch within 24 hours.",
};

export default function BookingConfirmPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="container mb-16 pt-24 sm:pt-28 lg:mb-24 lg:pt-32">
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] px-4 py-16 sm:px-8 sm:py-20 lg:rounded-[40px] lg:py-28",
            "from-primary/3 via-primary/8 to-primary/20 bg-linear-to-b",
          )}
        >
          {/* Ambient orbs — matches the site's PageHeader treatment */}
          <div
            aria-hidden
            className="bg-primary/10 pointer-events-none absolute top-1/4 -right-32 h-80 w-80 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-primary/10 pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
          />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
            {/* Success mark */}
            <ScrollReveal animation="zoom-in" durationMs={700}>
              <div className="relative mb-8">
                <div className="bg-primary absolute inset-0 rounded-full opacity-20 blur-2xl" />
                <span className="border-primary/20 bg-card relative z-10 flex h-24 w-24 items-center justify-center rounded-full border shadow-lg">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary h-14 w-14"
                  />
                </span>
              </div>
            </ScrollReveal>

            {/* Eyebrow + heading */}
            <ScrollReveal animation="fade-in-up" delayMs={120} durationMs={700}>
              <span className="bg-primary/10 text-primary border-primary/20 mb-6 inline-flex rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
                Booking Received
              </span>
              <h1 className="font-heading text-foreground text-3xl leading-[115%] font-black tracking-tight sm:text-4xl md:text-5xl">
                Thank you — you&apos;re all set.
              </h1>
              <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed font-medium sm:text-lg">
                We&apos;ve received your request. Our team will reach out within
                24 hours to lock in your call — no pitch deck, just a real
                conversation about your goals.
              </p>
            </ScrollReveal>

            {/* Inbox hint */}
            <ScrollReveal animation="fade-in-up" delayMs={220} durationMs={700}>
              <div className="border-border/60 bg-card/50 text-muted-foreground mt-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="text-primary size-4 shrink-0"
                />
                Keep an eye on your inbox for our confirmation.
              </div>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal animation="fade-in-up" delayMs={320} durationMs={700}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group from-primary-from to-primary-to hover:shadow-primary bg-linear-to-br px-6 font-semibold shadow-md",
                  )}
                >
                  Back to Home
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/works"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "px-6 font-semibold",
                  )}
                >
                  Explore our work
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
