"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ABOUT_STORY_DATA } from "@/data/about.data";
import { cn } from "@/lib/utils";

export function AboutStory() {
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
          title="Merging Art and Science"
          description="Our journey of combining creative excellence with backend growth infrastructure."
          label="Our Story"
        />

        <div className="flex flex-col lg:flex-row gap-12 mt-16 lg:mt-24" ref={containerRef}>
          {/* Left - Sticky Image Container */}
          <div className="lg:w-1/2 relative">
            <div className="sticky top-32 lg:top-40 aspect-square sm:aspect-[4/3] lg:aspect-square w-full rounded-[32px] overflow-hidden bg-muted border border-primary/10 shadow-sm transition-all duration-500">
              <Image
                src={ABOUT_STORY_DATA[activeIndex]?.image || ABOUT_STORY_DATA[0].image}
                alt={ABOUT_STORY_DATA[activeIndex]?.title || "Story image"}
                fill
                priority
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 border border-primary/10 rounded-[32px] pointer-events-none" />
            </div>
          </div>

          {/* Right - Scrolling Cards */}
          <div className="lg:w-1/2 space-y-8 lg:space-y-16 pb-16 lg:pb-32 lg:pl-10 relative">
            {/* Minimalist vertical tracker line for desktop */}
            <div className="hidden lg:block absolute left-2 top-0 bottom-0 w-px bg-primary/10" />

            {ABOUT_STORY_DATA.map((card, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "story-card relative p-6 sm:p-10 rounded-[24px] transition-all duration-500 border",
                    isActive
                      ? "bg-card border-primary/20 shadow-lg scale-100 opacity-100"
                      : "bg-transparent border-transparent scale-95 opacity-50"
                  )}
                >
                  {/* Active dot tracker for desktop */}
                  <div 
                    className={cn(
                      "hidden lg:block absolute left-[7px] top-12 w-2 h-2 rounded-full transition-all duration-500 -translate-x-full",
                      isActive ? "bg-primary scale-150" : "bg-primary/20 scale-100"
                    )} 
                  />
                  
                  <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    {card.title}
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
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
