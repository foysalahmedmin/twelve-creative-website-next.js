"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { Card } from "@/components/ui/card";
import {
  INDUSTRIES_DATA,
  type TIndustryIconKey,
} from "@/data/industries.data";
import { cn } from "@/lib/utils";
import {
  Airplane01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  Building04Icon,
  Restaurant01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

const INDUSTRY_ICON_MAP: Record<TIndustryIconKey, typeof Restaurant01Icon> = {
  hospitality: Restaurant01Icon,
  "real-estate": Building04Icon,
  aviation: Airplane01Icon,
  "professional-services": Briefcase01Icon,
};

export const IndustriesSection = ({ className }: { className?: string }) => {
  const [activeId, setActiveId] = useState(INDUSTRIES_DATA[0].id);
  const activeIndustry =
    INDUSTRIES_DATA.find((i) => i.id === activeId) ?? INDUSTRIES_DATA[0];
  const ActiveIcon = INDUSTRY_ICON_MAP[activeIndustry.icon];

  return (
    <section
      className={cn(
        "relative bg-background py-20 sm:py-24 lg:py-32",
        className,
      )}
    >
      {/* Section card background */}
      <div className="container">
        <div className="from-primary/5 to-primary/2 ring-primary/15 relative overflow-hidden rounded-4xl bg-linear-to-br p-6 ring-1 sm:p-10 lg:p-16">
          <div
            aria-hidden
            className="bg-primary/10 absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"
          />

          <div className="relative">
            <CenteredSectionHeader
              label="Industries"
              title="Industries we work with."
              description="We work across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
              className="mb-10 lg:mb-12"
            />

            {/* Tab Pills */}
            <div className="mb-10 flex justify-center">
              <div className="border-border bg-card inline-flex flex-wrap items-center justify-center gap-1 rounded-full border p-1.5 shadow-sm">
                {INDUSTRIES_DATA.map((industry) => {
                  const isActive = industry.id === activeId;
                  return (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => setActiveId(industry.id)}
                      className={cn(
                        "rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200",
                        isActive
                          ? "from-primary-from to-primary-to text-primary-foreground bg-linear-to-br shadow"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted",
                      )}
                      aria-pressed={isActive}
                    >
                      {industry.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Industry Content */}
            <Card className="ring-primary/20 bg-card grid grid-cols-1 gap-0 overflow-hidden p-0 ring-1 lg:grid-cols-2">
              {/* Left: Content */}
              <div className="space-y-6 p-8 sm:p-10 lg:p-12">
                <div className="space-y-3">
                  <span className="text-primary text-xs font-bold tracking-widest uppercase">
                    {activeIndustry.name}
                  </span>
                  <h3 className="font-heading text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {activeIndustry.headline}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {activeIndustry.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-foreground text-sm font-semibold">
                    What we offer
                  </p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {activeIndustry.work.map((item) => (
                      <li
                        key={item}
                        className="text-foreground/80 flex items-start gap-2 text-sm"
                      >
                        <HugeiconsIcon
                          icon={Tick02Icon}
                          className="text-primary mt-0.5 h-4 w-4 shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={activeIndustry.href}
                  className="text-primary group/link inline-flex items-center gap-1.5 text-sm font-semibold"
                >
                  Book a Call
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 transition-transform group-hover/link:translate-x-1"
                  />
                </Link>
              </div>

              {/* Right: Visual */}
              <div className="from-primary/10 to-primary/5 relative flex min-h-80 items-center justify-center overflow-hidden bg-linear-to-br p-8 lg:min-h-full">
                <div
                  aria-hidden
                  className="bg-primary/20 absolute -top-12 -right-12 h-56 w-56 rounded-full blur-3xl"
                />
                <div
                  aria-hidden
                  className="bg-primary/15 absolute -bottom-12 -left-12 h-56 w-56 rounded-full blur-3xl"
                />

                <div className="relative flex flex-col items-center gap-6 text-center">
                  <div className="bg-card text-primary ring-primary/20 flex h-32 w-32 items-center justify-center rounded-3xl ring-8 shadow-xl backdrop-blur-sm">
                    <HugeiconsIcon icon={ActiveIcon} className="h-16 w-16" />
                  </div>
                  <p className="font-heading text-foreground text-2xl font-bold tracking-tight">
                    {activeIndustry.name}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
