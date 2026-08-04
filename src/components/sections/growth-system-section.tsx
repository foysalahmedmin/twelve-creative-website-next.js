"use client";

import {
  GROWTH_SYSTEM_DATA,
  type GrowthSystemData,
} from "@/data/growth-system.data";
import { CmsMediaDisplay } from "@/components/common/cms-media-display";
import type { GrowthSystemSection as CmsGrowthSystemSection } from "@/lib/api/shared-sections";
import { cn } from "@/lib/utils";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type CSSProperties, type ReactNode } from "react";

interface GrowthSystemSectionProps {
  data?: GrowthSystemData;
  cmsData?: CmsGrowthSystemSection;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

// One full-screen sticky card. Cards stack over one another as the page
// scrolls (increasing z-index) — the same one-by-one parallax as WorkWithUs.
// Pinning is enabled on all breakpoints, not just lg: — see the content
// wrapper below for how it stays safe on short mobile viewports.
function StackCard({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: ReactNode;
}) {
  return (
    <div
      className="sticky top-0 h-dvh w-full overflow-hidden"
      style={{ zIndex: index + 1 }}
    >
      {/* Frosted brand background — lets the previous card blur through */}
      <div
        className={cn(
          "from-background via-background/60 to-muted/40 absolute inset-0 border-y bg-linear-to-br backdrop-blur-xl",
          index === 0 && "border-t-0",
          index === total - 1 && "border-b-0",
        )}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient brand glow */}
      <div
        aria-hidden
        className="bg-brand-glow pointer-events-none absolute inset-0"
      />

      {/* Content — h-full + min-h-0 let this shrink inside the pinned card;
          overflow-y-auto is a safety net so unusually long CMS copy scrolls
          within the card instead of being clipped or pushed off-screen. */}
      <div className="relative z-10 container flex h-full min-h-0 flex-col justify-center overflow-y-auto py-10 lg:py-20">
        {children}

        {/* Progress indicators */}
        <div className="mt-6 flex gap-2 lg:absolute lg:right-0 lg:bottom-10 lg:left-0 lg:container lg:mt-0">
          {Array.from({ length: total }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-px transition-all duration-300",
                idx === index ? "bg-primary w-8" : "bg-foreground/15 w-4",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function GrowthSystemSection({
  data = GROWTH_SYSTEM_DATA,
  cmsData,
  className,
}: GrowthSystemSectionProps) {
  const resolved = cmsData
    ? {
        tag: cmsData.label ?? "",
        heading_title: cmsData.title,
        paragraph: cmsData.description,
        steps: cmsData.content.steps.map((step) => ({
          title: step.title,
          description: step.description,
          media: step.media,
          items: step.items.map((item) => item.text),
        })),
      }
    : {
        ...data,
        steps: data.steps.map((step) => ({
          ...step,
          media: { type: "image", image: step.image } as const,
        })),
      };
  const { tag, heading_title, paragraph, steps } = resolved;
  if (!steps?.length) return null;

  const total = steps.length + 1; // intro card + one card per stage

  return (
    <section
      className={cn("relative h-[var(--stack-height)]", className)}
      style={{ "--stack-height": `${total * 100}dvh` } as CSSProperties}
    >
      {/* ── Intro card ── */}
      <StackCard index={0} total={total}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <span className="border-primary/30 text-primary mb-6 inline-flex items-center rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
              {tag}
            </span>
            <h2 className="font-heading text-foreground text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl lg:text-6xl">
              {heading_title}
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                The System
              </span>
              <span className="bg-border h-px flex-1" />
            </div>
            <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
              {paragraph}
            </p>
            <p className="text-muted-foreground/70 text-sm">
              {pad(steps.length)} connected stages — scroll to move through the
              build.
            </p>
          </div>
        </div>
      </StackCard>

      {/* ── Stage cards ── */}
      {steps.map((step, i) => (
        <StackCard key={i} index={i + 1} total={total}>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Media with ghost stage numeral */}
            <div className="relative">
              <span className="font-heading text-primary/10 pointer-events-none absolute -top-14 -left-2 z-0 hidden text-[8rem] leading-none font-black select-none lg:block">
                {pad(i + 1)}
              </span>
              <div className="border-border relative z-10 aspect-16/10 max-h-[22vh] w-full overflow-hidden rounded-2xl border shadow-xl lg:max-h-none lg:rounded-3xl">
                <CmsMediaDisplay
                  media={step.media}
                  alt={step.title}
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="from-background/25 absolute inset-0 bg-linear-to-t to-transparent" />
              </div>
            </div>

            {/* Copy + checklist */}
            <div className="space-y-3 lg:space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                  Stage {pad(i + 1)} / {pad(steps.length)}
                </span>
                <span className="bg-border h-px flex-1" />
              </div>
              <h3 className="font-heading text-foreground text-3xl leading-[1.1] font-black tracking-tight sm:text-4xl lg:text-5xl">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
                {step.description}
              </p>
              <ul className="grid gap-2.5 pt-1 lg:gap-3">
                {step.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-foreground/90 flex items-start gap-3 text-sm font-medium md:text-base"
                  >
                    <span className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="size-3"
                        strokeWidth={3}
                      />
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StackCard>
      ))}
    </section>
  );
}

export default GrowthSystemSection;
