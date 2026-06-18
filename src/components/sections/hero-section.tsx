"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { HOME_HERO_DATA, type THomeHero } from "@/data/home-hero.data";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface HeroSectionProps {
  className?: string;
  data?: Partial<THomeHero>;
}

export const HeroSection = ({ className, data: override }: HeroSectionProps) => {
  const data = { ...HOME_HERO_DATA, ...override };

  return (
    <section className={cn("relative container mt-6 mb-10", className)}>
      {/* Outer rounded hero card with background gradient */}
      <div
        className={cn(
          "relative min-h-screen overflow-hidden rounded-2xl lg:rounded-[40px]",
          "from-primary/3 via-primary/8 to-primary/25 bg-linear-to-b",
        )}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden
          className="bg-primary/15 pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="bg-primary/10 pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl"
        />

        <div className="relative flex flex-col items-center justify-center gap-4 px-2 pt-32 pb-10 lg:gap-4 lg:pt-28">
          {/* Center column for badge + headline + description + CTAs */}
          <div className="mx-auto flex max-w-195 flex-col items-center justify-center pt-10">
            {/* Headline */}
            <ScrollReveal animation="fade-in-up" delayMs={120} durationMs={800}>
              <h1 className="text-foreground font-heading mt-4 text-center text-[40px] leading-[110%] font-medium tracking-tight lg:mt-5 lg:text-[70px]">
                {data.title}
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal animation="fade-in-up" delayMs={250} durationMs={800}>
              <p className="text-muted-foreground mt-6 text-center text-sm leading-[150%] font-normal md:text-base">
                {data.description}
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal
              animation="fade-in-up"
              delayMs={380}
              durationMs={800}
              className="w-full"
            >
              <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 px-4 md:flex-row md:px-0">
                <Link
                  href={data.primary_cta.href}
                  className={cn(buttonVariants({ size: "xl" }))}
                >
                  {data.primary_cta.label}
                </Link>
                <Link
                  href={data.secondary_cta.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xl" }),
                  )}
                >
                  {data.secondary_cta.label}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Video showcase */}
          <ScrollReveal
            animation="zoom-in"
            delayMs={500}
            durationMs={900}
            className="w-full px-4 lg:px-12"
          >
            <div className="ring-foreground/10 relative mx-auto mt-8 aspect-video w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl ring-1 lg:mt-10 lg:rounded-[40px]">
              <ReactPlayer
                src={data.video.src}
                controls
                width="100%"
                height="100%"
                playsInline
                light={data.video.poster || false}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
