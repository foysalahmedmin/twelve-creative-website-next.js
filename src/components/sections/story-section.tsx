"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ABOUT_STORY_DATA } from "@/data/about.data";
import type { ContentSection } from "@/lib/api/site-setting";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface StorySectionProps {
  contentSection?: ContentSection;
}

export function StorySection({ contentSection }: StorySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll(".story-card");
      const centerPoint = window.innerHeight / 2;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // The card whose body is crossing the vertical centre of the screen.
        if (rect.top <= centerPoint && rect.bottom >= centerPoint) {
          setActiveIndex(index);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // A single admin-provided image (if set) overrides the per-card images.
  const overrideImage = contentSection?.image;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container max-w-7xl">
        <CenteredSectionHeader
          title={contentSection?.title || "Merging Art and Science"}
          description={
            contentSection?.body ||
            "Our journey of combining creative excellence with backend growth infrastructure."
          }
          label={contentSection?.subtitle || "Our Story"}
        />

        <div
          className="mt-16 flex flex-col gap-12 lg:mt-24 lg:flex-row lg:items-start"
          ref={containerRef}
        >
          {/* ── Left: centered, height-capped sticky image (desktop only) ──
              The column is the sticky element and a fixed-height track that
              vertically centres the media, so the image always stays centred
              and never runs off the bottom of a short laptop screen. */}
          <div className="hidden lg:sticky lg:top-[8vh] lg:flex lg:h-[84vh] lg:w-1/2 lg:shrink-0 lg:items-center lg:self-start">
            {/* Capped media card — aspect + max-height keep it from oversizing */}
            <div className="bg-muted border-border relative aspect-square max-h-[72vh] w-full overflow-hidden rounded-3xl border shadow-sm">
              {overrideImage ? (
                <Image
                  src={overrideImage}
                  alt={contentSection?.title || "Our story"}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                ABOUT_STORY_DATA.map((card, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      index === activeIndex ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))
              )}
              <div className="border-border pointer-events-none absolute inset-0 rounded-3xl border" />
            </div>
          </div>

          {/* ── Right: scrolling cards ──
              Desktop gets vertical runway so every card reaches centre while
              the image is already pinned — no drift. Mobile has no runway. */}
          <div className="lg:w-1/2 lg:py-[34vh]">
            <div className="relative lg:pl-10">
              {/* Minimalist vertical tracker line — desktop, spans the cards */}
              <div className="bg-border absolute top-0 bottom-0 left-2 hidden w-px lg:block" />

              <div className="space-y-8 lg:space-y-16">
                {ABOUT_STORY_DATA.map((card, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "story-card relative rounded-2xl border p-6 transition-all duration-500 sm:p-10",
                        // Mobile: every card stays a legible card. Desktop:
                        // the inactive cards recede so the active one leads.
                        isActive
                          ? "border-border bg-card opacity-100 shadow-sm lg:scale-100"
                          : "border-border bg-card opacity-100 lg:scale-95 lg:border-transparent lg:bg-transparent lg:opacity-50",
                      )}
                    >
                      {/* Active dot tracker — desktop */}
                      <div
                        className={cn(
                          "absolute top-12 left-1.75 hidden h-2 w-2 -translate-x-full rounded-full transition-all duration-500 lg:block",
                          isActive
                            ? "bg-primary scale-150"
                            : "bg-primary/20 scale-100",
                        )}
                      />

                      <h3 className="font-heading text-foreground mb-4 text-2xl font-black tracking-tight md:text-3xl">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                        {card.description}
                      </p>

                      {/* Per-card image — mobile only, expands with the active
                          card so the visual always travels with its story. */}
                      <div
                        className={cn(
                          "overflow-hidden rounded-2xl transition-all duration-500 ease-in-out lg:hidden",
                          isActive
                            ? "mt-6 max-h-105 opacity-100"
                            : "mt-0 max-h-0 opacity-0",
                        )}
                      >
                        <div className="border-border/40 relative aspect-4/3 w-full overflow-hidden rounded-2xl border">
                          <Image
                            src={overrideImage || card.image}
                            alt={card.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
