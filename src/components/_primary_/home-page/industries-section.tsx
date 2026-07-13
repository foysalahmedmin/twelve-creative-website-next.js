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
import {
  Airplane01Icon,
  Briefcase01Icon,
  Building04Icon,
  Restaurant01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as any;

const INDUSTRY_ICON_MAP: Record<TIndustryIconKey, typeof Restaurant01Icon> = {
  hospitality: Restaurant01Icon,
  "real-estate": Building04Icon,
  aviation: Airplane01Icon,
  "professional-services": Briefcase01Icon,
};

interface Props {
  className?: string;
  data?: TIndustry[];
}

export const IndustriesSection = ({ className, data }: Props) => {
  const industries = data && data.length ? data : INDUSTRIES_DATA;
  const [activeId, setActiveId] = useState(industries[0].id);

  return (
    <section className={cn("w-full bg-muted py-16 sm:py-20 lg:py-24", className)}>
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <div className="relative z-10 px-4 sm:px-8 lg:px-16">
            {/* Header styled exactly like Our Works */}
            <CenteredSectionHeader
              label="Industries"
              title="Industries We Work With"
              description="We work across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
              className="mb-10 lg:mb-12"
            />

            <Tabs
              value={activeId}
              onValueChange={setActiveId}
              className="w-full flex flex-col items-center"
            >
              {/* Tab Pills - Styled exactly like the old glass navigation bar */}
              <div className="mb-12 w-full overflow-x-auto scrollbar-none pb-2">
                <div className="flex min-w-max justify-center px-4">
                <TabsList className="border border-border bg-card p-1.5 rounded-2xl flex gap-1">
                  {industries.map((industry) => {
                    const Icon = INDUSTRY_ICON_MAP[industry.icon];
                    return (
                      <TabsTrigger
                        key={industry.id}
                        value={industry.id}
                        className="rounded-lg px-4 py-2.5 sm:px-6 text-sm font-semibold flex items-center gap-2 transition-all hover:bg-muted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <HugeiconsIcon icon={Icon} className="size-4 shrink-0" />
                        {industry.name}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                </div>
              </div>

              {industries.map((industry) => (
                <TabsContent
                  key={industry.id}
                  value={industry.id}
                  className="w-full max-w-5xl outline-none relative"
                >
                  {/* Content Card with Glass shadow and premium layout */}
                  <Card className="border border-border bg-card relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl p-6 sm:p-8 lg:p-10">
                    
                    {/* Left: Content */}
                    <div className="space-y-6 flex flex-col justify-center lg:pr-4">
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
                        <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">
                          What we offer
                        </h4>
                        <ul className="space-y-3">
                          {industry.work.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 text-sm text-foreground/90 font-medium"
                            >
                              <span className="flex items-center justify-center size-5 rounded-full border border-primary/30 text-primary shrink-0">
                                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.05em] text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 group/cta"
                        >
                          Book a Call
                          <span className="transition-transform duration-200 group-hover/cta:translate-x-1">&gt;</span>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Visual Showcase — plays the industry video when set,
                        otherwise shows the thumbnail/image; appears first on mobile */}
                    <div className="order-first lg:order-last relative overflow-hidden rounded-2xl border border-border aspect-4/3 w-full">
                      {industry.videoSrc ? (
                        <ReactPlayer
                          src={industry.videoSrc}
                          controls
                          playsInline
                          width="100%"
                          height="100%"
                          light={industry.thumbnailSrc || industry.image || true}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <>
                          <img
                            src={industry.thumbnailSrc || industry.image}
                            alt={industry.name}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          {/* Subtle premium glass overlay */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                        </>
                      )}
                    </div>
                  </Card>

                  {/* 3D Offset layered bottom card peeking from the bottom exactly like the user's screenshot */}
                  <div className="absolute -bottom-3 left-[3%] right-[3%] h-12 bg-primary/15 dark:bg-primary/25 rounded-b-3xl z-0 border-x border-b border-border pointer-events-none" />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
