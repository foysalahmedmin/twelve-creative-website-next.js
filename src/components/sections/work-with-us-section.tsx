"use client";

import { cn } from "@/lib/utils";

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

export function WorkWithUsSection() {
  return (
    <section
      id="workwithus"
      className="relative"
      style={{ height: `${CARDS.length * 100}vh` }}
    >
      {CARDS.map((card, i) => (
        <div
          key={i}
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ zIndex: i + 1 }}
        >
          {/* Background — semi-opaque gradient, not fully black */}
          <div
            className={cn(
              "from-background via-background/50 to-muted/50 absolute inset-0 border-y bg-linear-to-br backdrop-blur-xl",
              i === 0 && "border-t-0",
              i === CARDS.length - 1 && "border-b-0",
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
          <div className="relative z-10 container flex h-full flex-col justify-center py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
              {/* Left column */}
              <div className="space-y-6">
                {i === 0 ? (
                  /* First card: "Work With Us" in primary color */
                  <h2 className="font-heading text-primary text-5xl leading-[105%] font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                    Work
                    <br />
                    With Us
                  </h2>
                ) : (
                  /* Other cards: large transparent number */
                  <span className="font-heading text-foreground/8 text-[9rem] leading-none font-black select-none lg:text-[12rem]">
                    {card.number}
                  </span>
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
            <div className="absolute right-0 bottom-10 left-0 container flex gap-2">
              {CARDS.map((_, idx) => (
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
