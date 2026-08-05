"use client";

import { BookingModal } from "@/components/common/booking-modal";
import { InlineVideoPlayer } from "@/components/common/inline-video-player";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { buttonVariants } from "@/components/ui/button";
import { HERO_DATA, type THero } from "@/data/hero.data";
import type { TBookingData } from "@/data/booking.data";
import type { PublicIndustryOption } from "@/lib/api/industries";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface HeroSectionProps {
  className?: string;
  data?: Omit<Partial<THero>, "primary_cta" | "secondary_cta" | "video"> & {
    primary_cta?: THero["primary_cta"] | null;
    secondary_cta?: THero["secondary_cta"] | null;
    video?: THero["video"] | null;
  };
  calendlyUrl?: string;
  industries?: PublicIndustryOption[];
  booking?: TBookingData;
}

export const HeroSection = ({
  className,
  data: override,
  calendlyUrl,
  industries = [],
  booking,
}: HeroSectionProps) => {
  const data = { ...HERO_DATA, ...override };
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
                  <InlineVideoPlayer
                    src={data.video.src}
                    title={data.title ?? "Twelve Creative"}
                    thumbnailSrc={data.video.poster}
                    className="h-full"
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
            <div className="border-foreground/10 relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border shadow-sm lg:mt-10 lg:rounded-3xl">
              {data.video.src ? (
                <InlineVideoPlayer
                  src={data.video.src}
                  title={data.title ?? "Twelve Creative"}
                  thumbnailSrc={data.video.poster}
                  className="h-full"
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
          booking={booking}
        />
      )}
    </section>
  );
};
