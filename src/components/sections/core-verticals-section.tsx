"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { VERTICALS_DATA } from "@/data/verticals.data";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type CardItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  videoSrc?: string;
  href: string;
};

export type IndustryCardData = {
  slug: string;
  name: string;
  description: string;
  image: string;
  video?: { source: string; value: string } | null;
};

function fromIndustry(industry: IndustryCardData): CardItem {
  return {
    id: industry.slug,
    title: industry.name,
    description: industry.description,
    image: industry.image,
    videoSrc: industry.video?.value || undefined,
    href: `/industries/${industry.slug}`,
  };
}

function fromVertical(v: (typeof VERTICALS_DATA)[0]): CardItem {
  return {
    id: v.id,
    title: v.title,
    description: v.description,
    image: v.image,
    videoSrc: v.video || undefined,
    href: v.href,
  };
}

interface Props {
  industries?: IndustryCardData[];
}

export function CoreVerticalsSection({ industries }: Props) {
  const cards: CardItem[] = industries?.length
    ? industries.map(fromIndustry)
    : VERTICALS_DATA.map(fromVertical);

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
    }
  };

  return (
    <section className="container py-10 lg:py-14">
      <ScrollReveal animation="fade-in-up" durationMs={700}>
        <CenteredSectionHeader
          label="Industries"
          title="Core Verticals"
          description="We work across a focused set of industries where marketing structure, creative execution, and conversion systems make the biggest difference."
          className="mb-8 lg:mb-10"
        />
      </ScrollReveal>

      <div className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto pb-4 lg:pb-0">
        {cards.map((card, index) => {
          const isHovered = hoveredId === card.id;
          const isFirst = index === 0;
          const isLast = index === cards.length - 1;

          return (
            <Link
              key={card.id}
              href={card.href}
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden",
                "w-[80vw] sm:w-[60vw] lg:w-0 lg:flex-1",
                "h-[500px] lg:h-[580px]",
                isFirst ? "rounded-l-3xl" : "",
                isLast ? "rounded-r-3xl" : "",
                "rounded-2xl lg:rounded-none",
                isFirst && "lg:rounded-l-3xl",
                isLast && "lg:rounded-r-3xl",
                "cursor-pointer select-none",
              )}
              onMouseEnter={() => handleMouseEnter(card.id)}
              onMouseLeave={() => handleMouseLeave(card.id)}
            >
              {/* Static image */}
              <img
                src={card.image}
                alt={card.title}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                  isHovered && !!card.videoSrc ? "scale-105 opacity-0" : isHovered ? "scale-105 opacity-100" : "scale-100 opacity-100",
                )}
                draggable={false}
              />

              {/* Video (plays on hover) */}
              {card.videoSrc && (
                <video
                  ref={(el) => {
                    videoRefs.current[card.id] = el;
                  }}
                  muted
                  loop
                  playsInline
                  src={card.videoSrc}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    isHovered ? "opacity-100" : "opacity-0",
                  )}
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-7 lg:p-8">
                <div>
                  <h3 className="font-heading text-3xl leading-none font-black tracking-tight text-white lg:text-4xl">
                    {card.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-white/80 lg:text-base">
                    {card.description}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300",
                      isHovered
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0",
                    )}
                  >
                    <span className="text-xs font-bold tracking-widest text-white uppercase">
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
