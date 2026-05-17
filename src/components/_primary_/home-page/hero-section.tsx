"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { HOME_HERO_DATA } from "@/data/home-hero.data";
import { cn } from "@/lib/utils";
import {
  Airplane01Icon,
  Briefcase01Icon,
  Building04Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const AVATAR_ICON_MAP: Record<string, typeof Restaurant01Icon> = {
  restaurant: Restaurant01Icon,
  building: Building04Icon,
  airplane: Airplane01Icon,
  briefcase: Briefcase01Icon,
};

export const HeroSection = ({ className }: { className?: string }) => {
  const data = HOME_HERO_DATA;

  return (
    <section className={cn("container relative mb-10", className)}>
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
          <div className="mx-auto flex max-w-[780px] flex-col items-center justify-center pt-10">
            {/* Trust badge */}
            <div
              className={cn(
                "bg-card/40 ring-foreground/10 inline-flex items-center justify-center gap-4 rounded-full py-3 pl-3 pr-5 ring-1 backdrop-blur-lg",
                "shadow-[0_8px_30px_-12px] shadow-primary/20",
              )}
            >
              <div className="flex items-center -space-x-2">
                {data.trust_avatars.map((avatar, index) => {
                  const Icon = AVATAR_ICON_MAP[avatar.icon];
                  return (
                    <div
                      key={avatar.id}
                      style={{ zIndex: data.trust_avatars.length - index }}
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        "from-primary-from to-primary-to text-primary-foreground bg-linear-to-br",
                        "ring-card ring-2",
                      )}
                      aria-label={avatar.label}
                    >
                      <HugeiconsIcon icon={Icon} className="h-3.5 w-3.5" />
                    </div>
                  );
                })}
              </div>
              <p className="text-foreground text-xs font-medium leading-[140%]">
                {data.trust_label}
              </p>
            </div>

            {/* Headline */}
            <h1 className="text-foreground font-heading mt-4 text-center text-[40px] font-medium leading-[110%] tracking-tight lg:mt-5 lg:text-[70px]">
              {data.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mt-6 text-center text-sm font-normal leading-[150%] md:text-base">
              {data.description}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 px-4 md:flex-row md:px-0">
              <Link
                href={data.primary_cta.href}
                className={cn(
                  buttonVariants(),
                  "from-primary-from to-primary-to hover:shadow-primary h-14 w-full bg-linear-to-br px-5 py-4 text-sm font-medium shadow-lg transition-transform duration-200 hover:scale-105 md:w-[156px]",
                  "rounded-xl",
                )}
              >
                {data.primary_cta.label}
              </Link>
              <Link
                href={data.secondary_cta.href}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "bg-card/40 ring-foreground/10 h-14 w-full px-5 py-4 text-sm font-medium backdrop-blur-sm ring-1 transition-transform duration-200 hover:scale-105 md:w-[156px]",
                  "rounded-xl",
                )}
              >
                {data.secondary_cta.label}
              </Link>
            </div>
          </div>

          {/* Video showcase */}
          <div className="relative mx-auto mt-8 aspect-video w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-foreground/10 lg:mt-10 lg:rounded-[40px]">
            <ReactPlayer
              src={data.video.src}
              controls
              width="100%"
              height="100%"
              playsInline
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
