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
import Link from "next/link";
import { useState } from "react";

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
    <section className={cn("container mt-6 md:mt-10 lg:mt-12", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        {/* Background-gradient wrapper card exactly like Our Works & Testimonials */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] py-10 lg:rounded-[40px] lg:py-16",
            "from-primary/6 via-primary/3 to-primary/4 bg-linear-to-b",
          )}
        >
          {/* Decorative backdrop shapes inside container */}
          <div className="bg-primary/5 absolute top-1/4 left-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute right-0 bottom-1/4 h-80 w-80 translate-x-1/2 rounded-full blur-3xl" />

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
                <TabsList className="border border-white/10 bg-card/45 backdrop-blur-md p-1.5 rounded-2xl flex gap-1">
                  {industries.map((industry) => {
                    const Icon = INDUSTRY_ICON_MAP[industry.icon];
                    return (
                      <TabsTrigger
                        key={industry.id}
                        value={industry.id}
                        className="rounded-xl px-4 py-2.5 sm:px-6 text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
                  <Card className="border border-primary/15 bg-card/90 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-[32px] p-6 sm:p-8 lg:p-10">
                    
                    {/* Left: Content */}
                    <div className="space-y-6 flex flex-col justify-center lg:pr-4">
                      <div className="space-y-3">
                        <h3 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
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
                          className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-primary transition-colors group/cta"
                        >
                          Book a Call
                          <span className="transition-transform duration-200 group-hover/cta:translate-x-1 font-normal">&gt;</span>
                        </Link>
                      </div>
                    </div>

                    {/* Right: Visual Showcase Image — appears first on mobile */}
                    <div className="order-first lg:order-last relative overflow-hidden rounded-[24px] border border-white/10 aspect-4/3 w-full">
                      <img
                        src={industry.image}
                        alt={industry.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                      {/* Subtle premium glass overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </Card>

                  {/* 3D Offset layered bottom card peeking from the bottom exactly like the user's screenshot */}
                  <div className="absolute -bottom-3 left-[3%] right-[3%] h-12 bg-primary/15 dark:bg-primary/25 rounded-b-[28px] z-0 border-x border-b border-primary/10 pointer-events-none" />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
