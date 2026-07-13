"use client";

import { BrandTexture } from "@/components/common/brand";
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

export const HeroSection = ({
  className,
  data: override,
}: HeroSectionProps) => {
  const data = { ...HOME_HERO_DATA, ...override };

  return (
    <section className={cn("relative container mt-6 mb-10", className)}>
      {/* Outer rounded hero card with artefact gradient */}
      <div
        className={cn(
          "bg-brand-hero relative min-h-screen overflow-hidden rounded-3xl",
        )}
      >
        {/* Brand texture depth */}
        <BrandTexture opacity={35} />

        <div className="relative flex flex-col items-center justify-center gap-4 px-2 pt-10 pb-10 lg:gap-4 lg:pt-16">
          {/* Center column for badge + headline + description + CTAs */}
          <div className="mx-auto flex max-w-195 flex-col items-center justify-center pt-10">
            {/* Headline */}
            <ScrollReveal animation="fade-in-up" delayMs={120} durationMs={800}>
              <h1 className="font-heading mt-4 text-center text-[40px] leading-[110%] font-black tracking-tight text-[#eaeae4] lg:mt-5 lg:text-[70px]">
                {data.title}
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal animation="fade-in-up" delayMs={250} durationMs={800}>
              <p className="mt-6 text-center text-sm leading-[150%] font-normal text-[#eaeae4]/80 md:text-base">
                {data.description}
              </p>
            </ScrollReveal>

            {/* Video showcase */}
            <ScrollReveal
              animation="zoom-in"
              delayMs={500}
              durationMs={900}
              className="block w-full px-4 lg:hidden lg:px-12"
            >
              <div className="relative mx-auto mt-8 aspect-video w-full max-w-7xl overflow-hidden rounded-2xl border border-[#eaeae4]/10 shadow-sm lg:mt-10 lg:rounded-3xl">
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
                    "border-[#eaeae4]/40 text-[#eaeae4] hover:border-[#eaeae4]/60 hover:bg-[#eaeae4]/10 hover:text-[#eaeae4]",
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
            className="hidden w-full px-4 lg:block lg:px-12"
          >
            <div className="relative mx-auto mt-8 aspect-video w-full max-w-7xl overflow-hidden rounded-2xl border border-[#eaeae4]/10 shadow-sm lg:mt-10 lg:rounded-3xl">
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
