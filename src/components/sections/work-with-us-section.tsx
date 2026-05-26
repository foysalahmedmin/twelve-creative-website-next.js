"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CARDS = [
  {
    number: "01",
    label: "Clarity First",
    title: "We start with what the business is actually trying to move.",
    body: "Before any creative is made, we run a diagnostic — not a discovery call, a real interrogation of the business model, the offer, the current marketing, and where the real friction lives. Most agencies skip this. We live here.",
    cta: { label: "See Our Process", href: "/process" },
    bg: "from-neutral-950 to-neutral-900",
    accent: "text-primary",
  },
  {
    number: "02",
    label: "Built to Convert",
    title: "Every piece of creative is connected to a business outcome.",
    body: "We don't make content for content's sake. Each video, campaign, page, or ad is built with a job to do — drive a reservation, generate a lead, close a qualified buyer, or install a system that compounds over time.",
    cta: { label: "See Our Work", href: "/works" },
    bg: "from-neutral-900 to-zinc-950",
    accent: "text-amber-400",
  },
  {
    number: "03",
    label: "Long-Term Partnership",
    title: "We grow with the businesses we work with.",
    body: "Twelve Creative works with a small number of clients at once. That's intentional. When we're in, we're fully in — embedded in the business, accountable to results, and structured to evolve the strategy as the business grows.",
    cta: { label: "Start a Conversation", href: "/contact" },
    bg: "from-zinc-950 to-neutral-950",
    accent: "text-sky-400",
  },
];

export function WorkWithUsSection() {
  return (
    <section className="relative">
      {/* Section intro */}
      <div className="container py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
            Work With Us
          </span>
          <h2 className="font-heading text-foreground text-3xl font-medium tracking-tight leading-[115%] sm:text-4xl lg:text-5xl">
            How we work, and why it matters.
          </h2>
        </div>
      </div>

      {/* Sticky stacking cards */}
      <div
        className="relative"
        style={{ height: `${CARDS.length * 100}vh` }}
      >
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={cn(
              "sticky top-0 h-screen w-full overflow-hidden",
              `bg-gradient-to-br ${card.bg}`,
            )}
            style={{ zIndex: i + 1 }}
          >
            {/* Subtle grid pattern */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* Ambient orb */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: card.accent.replace("text-", "") === card.accent ? "#fff" : "#fff" }}
            />

            {/* Content */}
            <div className="container relative z-10 flex h-full flex-col justify-center py-20">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
                {/* Left */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-white/20 text-8xl font-bold leading-none select-none">
                      {card.number}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-[0.2em]",
                        card.accent,
                      )}
                    >
                      {card.label}
                    </span>
                  </div>
                  <h3 className="font-heading text-white text-3xl font-medium leading-[115%] tracking-tight sm:text-4xl lg:text-5xl">
                    {card.title}
                  </h3>
                </div>

                {/* Right */}
                <div className="space-y-8">
                  <p className="text-white/60 text-lg leading-relaxed lg:text-xl">
                    {card.body}
                  </p>
                  <Link
                    href={card.cta.href}
                    className="group inline-flex items-center gap-3 text-white font-semibold text-sm uppercase tracking-widest hover:gap-4 transition-all duration-200"
                  >
                    {card.cta.label}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Card index indicator */}
              <div className="absolute bottom-10 right-0 flex gap-2 container">
                {CARDS.map((_, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "h-0.5 transition-all duration-300",
                      idx === i ? "w-8 bg-white" : "w-4 bg-white/20",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
