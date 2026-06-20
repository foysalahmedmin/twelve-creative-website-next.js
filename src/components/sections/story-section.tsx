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
        // If the card is crossing the center of the screen
        if (rect.top <= centerPoint + 100 && rect.bottom >= centerPoint - 100) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container max-w-7xl">
        <CenteredSectionHeader
          title={contentSection?.title || "Merging Art and Science"}
          description={contentSection?.body || "Our journey of combining creative excellence with backend growth infrastructure."}
          label={contentSection?.subtitle || "Our Story"}
        />

        <div
          className="mt-16 flex flex-col gap-12 lg:mt-24 lg:flex-row"
          ref={containerRef}
        >
          {/* Left - Sticky Image Container */}
          <div className="relative lg:w-1/2">
            <div className="bg-muted border-primary/10 aspect-video w-full overflow-hidden rounded-[32px] border shadow-sm transition-all duration-500 lg:sticky lg:top-40 lg:aspect-square">
              <Image
                src={
                  contentSection?.image ||
                  ABOUT_STORY_DATA[activeIndex]?.image ||
                  ABOUT_STORY_DATA[0].image
                }
                alt={ABOUT_STORY_DATA[activeIndex]?.title || "Story image"}
                fill
                priority
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="border-primary/10 pointer-events-none absolute inset-0 rounded-[32px] border" />
            </div>
          </div>

          {/* Right - Scrolling Cards */}
          <div className="relative space-y-8 pb-16 lg:w-1/2 lg:space-y-16 lg:pb-32 lg:pl-10">
            {/* Minimalist vertical tracker line for desktop */}
            <div className="bg-primary/10 absolute top-0 bottom-0 left-2 hidden w-px lg:block" />

            {ABOUT_STORY_DATA.map((card, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "story-card relative rounded-[24px] border p-6 transition-all duration-500 sm:p-10",
                    isActive
                      ? "bg-card border-primary/20 scale-100 opacity-100 shadow-lg"
                      : "scale-95 border-transparent bg-transparent opacity-50",
                  )}
                >
                  {/* Active dot tracker for desktop */}
                  <div
                    className={cn(
                      "absolute top-12 left-[7px] hidden h-2 w-2 -translate-x-full rounded-full transition-all duration-500 lg:block",
                      isActive
                        ? "bg-primary scale-150"
                        : "bg-primary/20 scale-100",
                    )}
                  />

                  <h3 className="font-heading text-foreground mb-4 text-2xl font-semibold md:text-3xl">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
