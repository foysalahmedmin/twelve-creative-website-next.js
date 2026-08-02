"use client";

import { BookingModal } from "@/components/common/booking-modal";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { HOME_HERO_DATA, type THomeHero } from "@/data/home-hero.data";
import type { PublicIndustryOption } from "@/lib/api/industries";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface HeroSectionProps {
  className?: string;
  data?: Omit<Partial<THomeHero>, "primary_cta" | "secondary_cta" | "video"> & {
    primary_cta?: THomeHero["primary_cta"] | null;
    secondary_cta?: THomeHero["secondary_cta"] | null;
    video?: THomeHero["video"] | null;
  };
  calendlyUrl?: string;
  industries?: PublicIndustryOption[];
}

export const HeroSection = ({
  className,
  data: override,
  calendlyUrl,
  industries = [],
}: HeroSectionProps) => {
  const data = { ...HOME_HERO_DATA, ...override };
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section
      className={cn("bg-brand-hero relative w-full overflow-hidden", className)}
    >
      <div className="relative container flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-28 pb-16 sm:pt-32 lg:gap-4 lg:pt-36 lg:pb-24">
        {/* Center column for badge + headline + description + CTAs */}
        <div className="mx-auto flex max-w-195 flex-col items-center justify-center pt-10">
          {data.trust_label && (
            <ScrollReveal animation="fade-in-down" durationMs={700}>
              <span className="border-foreground/30 bg-background/20 text-foreground inline-flex rounded-md border px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase backdrop-blur-sm">
                {data.trust_label}
              </span>
            </ScrollReveal>
          )}

          {/* Headline */}
          {data.title && (
            <ScrollReveal animation="fade-in-up" delayMs={120} durationMs={800}>
              <h1 className="font-heading text-foreground mt-4 text-center text-[40px] leading-[110%] font-black tracking-tight lg:mt-5 lg:text-[70px]">
                {data.title}
              </h1>
            </ScrollReveal>
          )}

          {/* Description */}
          {data.description && (
            <ScrollReveal animation="fade-in-up" delayMs={250} durationMs={800}>
              <p className="text-foreground/80 mt-6 text-center text-sm leading-[150%] font-normal md:text-base">
                {data.description}
              </p>
            </ScrollReveal>
          )}

          {/* Video showcase */}
          {data.video && (data.video.src || data.video.poster) && (
            <ScrollReveal
              animation="zoom-in"
              delayMs={500}
              durationMs={900}
              className="w-full px-4 lg:hidden lg:px-12"
            >
              <div className="border-foreground/10 relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border shadow-sm lg:mt-10 lg:rounded-3xl">
                {data.video.src ? (
                  <ReactPlayer
                    src={data.video.src}
                    controls
                    width="100%"
                    height="100%"
                    playsInline
                    light={data.video.poster || false}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Image
                    src={data.video.poster!}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                )}
              </div>
            </ScrollReveal>
          )}

          {/* CTAs */}
          <ScrollReveal
            animation="fade-in-up"
            delayMs={380}
            durationMs={800}
            className="w-full"
          >
            {(data.primary_cta || data.secondary_cta) && (
              <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 px-4 md:flex-row md:px-0">
                {data.primary_cta &&
                  (calendlyUrl ? (
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ size: "xl" }))}
                    >
                      {data.primary_cta.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(true)}
                      className={cn(buttonVariants({ size: "xl" }))}
                    >
                      {data.primary_cta.label}
                    </button>
                  ))}
                {data.secondary_cta && (
                  <Link
                    href={data.secondary_cta.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "xl" }),
                      "border-foreground/40 text-foreground hover:border-foreground/60 hover:bg-foreground/10 hover:text-foreground",
                    )}
                  >
                    {data.secondary_cta.label}
                  </Link>
                )}
              </div>
            )}
          </ScrollReveal>
        </div>

        {/* Video showcase */}
        {data.video && (data.video.src || data.video.poster) && (
          <ScrollReveal
            animation="zoom-in"
            delayMs={500}
            durationMs={900}
            className="hidden w-full px-4 lg:block lg:px-12"
          >
            {/* max-w-4xl matches PageHeader's hero media, whose width is
                capped by that section's max-w-4xl column — so the home hero
                and every other page hero read at the same width. */}
            <div className="border-foreground/10 relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border shadow-sm lg:mt-10 lg:rounded-3xl">
              {data.video.src ? (
                <ReactPlayer
                  src={data.video.src}
                  controls
                  width="100%"
                  height="100%"
                  playsInline
                  light={data.video.poster || false}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Image
                  src={data.video.poster!}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
              )}
            </div>
          </ScrollReveal>
        )}
      </div>

      {!calendlyUrl && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          industries={industries}
        />
      )}
    </section>
  );
};
