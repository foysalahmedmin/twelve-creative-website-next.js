"use client";

import { cn } from "@/lib/utils";
import { CmsMediaDisplay } from "@/components/common/cms-media-display";
import type { WorkWithUsSection as CmsWorkWithUsSection } from "@/lib/api/shared-sections";
import type { CSSProperties } from "react";

const CARDS = [
  {
    number: "00",
    title: "How We Work",
    body: "Every engagement follows the same three-phase structure — intelligence, execution, and refinement. No guesswork, no generic playbooks. Just a clear system built around your business.",
  },
  {
    number: "01",
    title: "Market Intelligence",
    body: "We study the business, audience, competition, and market conditions before building anything. The goal is to understand what drives demand, what creates trust, and where the clearest opportunity exists.",
  },
  {
    number: "02",
    title: "Strategy Into Systems",
    body: "We turn the intelligence into a working growth system: messaging, landing pages, CRM, ads, email, SMS, tracking, and follow-up. Everything is built so attention has somewhere to go.",
  },
  {
    number: "03",
    title: "Optimization & Advisory",
    body: "Once the system is in motion, we monitor performance, streamline what is working, report what matters, maintain the infrastructure, and continue advising the business as new opportunities appear.",
  },
];

export function WorkWithUsSection({ data }: { data?: CmsWorkWithUsSection }) {
  const cards = data
    ? data.content.cards.map((card, index) => ({
        id: card.id,
        number: String(index).padStart(2, "0"),
        title: card.title,
        body: card.description,
        media: card.media,
      }))
    : CARDS.map((card, index) => ({
        ...card,
        id: `work-with-us-${index}`,
        media: undefined,
      }));
  if (!cards.length) return null;

  return (
    <section
      id="workwithus"
      className="relative lg:h-[var(--stack-height)]"
      style={{ "--stack-height": `${cards.length * 100}vh` } as CSSProperties}
    >
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="relative min-h-screen w-full overflow-visible lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          {/* Background — semi-opaque gradient, not fully black */}
          <div
            className={cn(
              "from-background via-background/50 to-muted/50 absolute inset-0 border-y bg-linear-to-br backdrop-blur-xl",
              i === 0 && "border-t-0",
              i === cards.length - 1 && "border-b-0",
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

          {/* Content */}
          <div className="relative z-10 container flex min-h-screen flex-col justify-center py-20 lg:h-full lg:min-h-0">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
              {/* Left column */}
              <div className="space-y-6">
                {i === 0 ? (
                  /* First card: "Work With Us" in primary color */
                  <h2 className="font-heading text-primary max-w-xl text-5xl leading-[105%] font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                    {data?.title ?? "Work With Us"}
                  </h2>
                ) : (
                  /* Other cards: large transparent number */
                  <span className="font-heading text-foreground/8 text-[9rem] leading-none font-black select-none lg:text-[12rem]">
                    {card.number}
                  </span>
                )}
                {card.media && (
                  <CmsMediaDisplay
                    media={card.media}
                    alt={card.title}
                    className="border-border/40 aspect-video w-full max-w-md rounded-2xl border"
                  />
                )}
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                    {card.number}
                  </span>
                  <span className="bg-border h-px flex-1" />
                </div>
                <h3 className="font-heading text-foreground text-3xl leading-[115%] font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed lg:text-lg">
                  {card.body}
                </p>
              </div>
            </div>

            {/* Progress indicators */}
            <div className="mt-10 flex gap-2 lg:absolute lg:right-0 lg:bottom-10 lg:left-0 lg:container lg:mt-0">
              {cards.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-px transition-all duration-300",
                    idx === i ? "bg-primary w-8" : "bg-foreground/15 w-4",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
