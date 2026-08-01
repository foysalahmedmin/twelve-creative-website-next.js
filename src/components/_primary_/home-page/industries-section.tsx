"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Card } from "@/components/ui/card";
import {
  INDUSTRIES_DATA,
  type TIndustry,
  type TIndustryIconKey,
} from "@/data/industries.data";
import { cn } from "@/lib/utils";
import type { HeadingSection } from "@/lib/api/shared-sections";
import {
  Airplane01Icon,
  Briefcase01Icon,
  Building04Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const INDUSTRY_ICON_MAP: Record<TIndustryIconKey, typeof Restaurant01Icon> = {
  hospitality: Restaurant01Icon,
  "real-estate": Building04Icon,
  aviation: Airplane01Icon,
  "professional-services": Briefcase01Icon,
};

interface Props {
  className?: string;
  data?: TIndustry[];
  heading?: HeadingSection | null;
}

export const IndustriesSection = ({ className, data, heading }: Props) => {
  const industries = data === undefined ? INDUSTRIES_DATA : data;
  const [activeId, setActiveId] = useState(industries[0]?.id ?? "");
  const activeIndustry =
    industries.find((industry) => industry.id === activeId) ?? industries[0];

  if (industries.length === 0) return null;

  return (
    <section
      className={cn("bg-muted w-full py-16 sm:py-20 lg:py-24", className)}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <div className="relative z-10 px-4 sm:px-8 lg:px-16">
            {/* Header styled exactly like Our Works */}
            {heading !== null && (
              <CenteredSectionHeader
                label={heading?.label ?? "Industries"}
                title={heading?.title ?? "Industries We Work With"}
                description={
                  heading?.description ??
                  "We work across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
                }
                className="mb-10 lg:mb-12"
              />
            )}

            <Tabs
              value={activeId}
              onValueChange={setActiveId}
              className="flex w-full flex-col items-center"
            >
              {/* Pill tabs — plenty of room at this width, so every industry
                  reads at a glance. Below lg a row of these either got cut
                  off or forced a scrollbar, so mobile gets a native select
                  instead (below) rather than a squeezed-down version of the
                  same row. */}
              <div className="mb-12 hidden w-full justify-center lg:flex">
                <TabsList className="border-border bg-card flex gap-1 rounded-2xl border p-1.5">
                  {industries.map((industry) => {
                    const Icon = INDUSTRY_ICON_MAP[industry.icon];
                    return (
                      <TabsTrigger
                        key={industry.id}
                        value={industry.id}
                        className="hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all sm:px-6"
                      >
                        <HugeiconsIcon icon={Icon} className="size-4 shrink-0" />
                        {industry.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Native select — one tap opens the OS's own picker sheet/wheel
                  instead of a row that has to fit N industries in ~360px.
                  Doesn't care how many industries there are or how long a
                  name runs, so renaming one in the CMS can't reintroduce the
                  cramped-row problem this replaces. */}
              <div className="mb-10 w-full max-w-xs px-4 lg:hidden">
                <div className="relative">
                  <NativeSelect
                    value={activeId}
                    onChange={(e) => setActiveId(e.target.value)}
                    aria-label="Choose an industry"
                    className="w-full"
                    selectClassName="border-border bg-card text-foreground h-12 rounded-2xl pl-11 pr-10 text-sm font-semibold shadow-sm"
                  >
                    {industries.map((industry) => (
                      <NativeSelectOption key={industry.id} value={industry.id}>
                        {industry.name}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  {/* Painted after the select (not before) so its opaque
                      background doesn't cover this — both sit at the same
                      auto stacking level, and later DOM order wins there. */}
                  <HugeiconsIcon
                    icon={INDUSTRY_ICON_MAP[activeIndustry.icon]}
                    className="text-primary pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
                  />
                </div>
              </div>

              {industries.map((industry) => {
                const reelVideoSrc = industry.reelVideoSrc ?? industry.videoSrc;
                const reelThumbnailSrc =
                  industry.reelThumbnailSrc ??
                  industry.thumbnailSrc ??
                  industry.image;

                return (
                  <TabsContent
                    key={industry.id}
                    value={industry.id}
                    className="relative w-full max-w-5xl outline-none"
                  >
                    {/* Content Card with Glass shadow and premium layout */}
                    <Card className="border-border bg-card relative z-10 grid grid-cols-1 items-center gap-8 rounded-3xl border p-6 sm:p-8 lg:grid-cols-2 lg:p-10">
                      {/* Left: Content */}
                      <div className="flex flex-col justify-center space-y-6 lg:pr-4">
                        <div className="space-y-3">
                          <h3 className="font-heading text-foreground text-3xl font-black tracking-tight sm:text-4xl">
                            {industry.name}
                          </h3>
                          <p className="text-muted-foreground text-base leading-relaxed font-medium">
                            {industry.description}
                          </p>
                        </div>

                        {/* What we offer */}
                        <div className="space-y-3">
                          <h4 className="text-foreground text-sm font-bold tracking-wider uppercase">
                            What we offer
                          </h4>
                          <ul className="space-y-3">
                            {industry.work.map((item) => (
                              <li
                                key={item}
                                className="text-foreground/90 flex items-center gap-3 text-sm font-medium"
                              >
                                <span className="border-primary/30 text-primary flex size-5 shrink-0 items-center justify-center rounded-full border">
                                  <svg
                                    className="size-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button/Link styled exactly like the screenshot */}
                        <div className="pt-2">
                          <Link
                            href={industry.href}
                            className="bg-primary text-primary-foreground group/cta inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold tracking-[0.05em] uppercase transition-transform duration-200 hover:-translate-y-0.5"
                          >
                            {industry.ctaLabel ?? "Book a Call"}
                            <span className="transition-transform duration-200 group-hover/cta:translate-x-1">
                              &gt;
                            </span>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Visual Showcase — plays the industry video when set,
                        otherwise shows the thumbnail/image; appears first on mobile */}
                      <div className="border-border relative order-first mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-2xl border lg:order-last [&_iframe]:h-full [&_iframe]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover">
                        {reelVideoSrc ? (
                          <ReactPlayer
                            src={reelVideoSrc}
                            playing
                            controls
                            playsInline
                            width="100%"
                            height="100%"
                            light={reelThumbnailSrc || true}
                            previewAriaLabel={`Play ${industry.name} reel`}
                            style={{ width: "100%", height: "100%" }}
                          />
                        ) : (
                          <>
                            <img
                              src={reelThumbnailSrc}
                              alt={industry.name}
                              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                            {/* Subtle premium glass overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                          </>
                        )}
                      </div>
                    </Card>

                    {/* 3D Offset layered bottom card peeking from the bottom exactly like the user's screenshot */}
                    <div className="bg-primary/15 dark:bg-primary/25 border-border pointer-events-none absolute right-[3%] -bottom-3 left-[3%] z-0 h-12 rounded-b-3xl border-x border-b" />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
