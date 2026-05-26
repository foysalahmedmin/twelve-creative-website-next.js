"use client";

import { VERTICALS_DATA } from "@/data/verticals.data";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export function CoreVerticalsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleMouseEnter = (id: string) => {
    setHoveredId(id);
    const video = videoRefs.current[id];
    if (video && video.src) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = (id: string) => {
    setHoveredId(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <section className="container py-10 lg:py-14">
      {/* Section label */}
      <div className="mb-6 flex items-center gap-3 lg:mb-8">
        <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
          Core Verticals
        </span>
      </div>

      {/* Cards row */}
      <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
        {VERTICALS_DATA.map((vertical, index) => {
          const isHovered = hoveredId === vertical.id;
          const isFirst = index === 0;
          const isLast = index === VERTICALS_DATA.length - 1;

          return (
            <Link
              key={vertical.id}
              href={vertical.href}
              className={cn(
                "group relative flex-shrink-0 snap-start overflow-hidden",
                "w-[80vw] sm:w-[60vw] lg:w-0 lg:flex-1",
                "h-[500px] lg:h-[580px]",
                isFirst ? "rounded-l-3xl" : "",
                isLast ? "rounded-r-3xl" : "",
                "rounded-2xl lg:rounded-none",
                isFirst && "lg:rounded-l-[32px]",
                isLast && "lg:rounded-r-[32px]",
                "cursor-pointer select-none",
              )}
              onMouseEnter={() => handleMouseEnter(vertical.id)}
              onMouseLeave={() => handleMouseLeave(vertical.id)}
            >
              {/* Static image */}
              <img
                src={vertical.image}
                alt={vertical.title}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                  isHovered ? "scale-105 opacity-0" : "scale-100 opacity-100",
                )}
                draggable={false}
              />

              {/* Video (plays on hover) */}
              {vertical.video && (
                <video
                  ref={(el) => { videoRefs.current[vertical.id] = el; }}
                  muted
                  loop
                  playsInline
                  src={vertical.video}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

              {/* Hover tint */}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isHovered ? "opacity-30" : "opacity-0",
                )}
                style={{ backgroundColor: vertical.accent }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-7 lg:p-8">
                {/* Top: Title */}
                <div>
                  <h3 className="font-heading text-white text-3xl font-bold tracking-tight leading-none lg:text-4xl">
                    {vertical.title}
                  </h3>
                </div>

                {/* Bottom: description + arrow */}
                <div className="space-y-3">
                  <p className="text-white/80 text-sm leading-relaxed lg:text-base">
                    {vertical.description}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300",
                      isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                    )}
                  >
                    <span className="text-white text-xs font-bold uppercase tracking-widest">
                      Explore
                    </span>
                    <ArrowUpRight className="size-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
