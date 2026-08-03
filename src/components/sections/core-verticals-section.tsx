"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { VERTICALS_DATA } from "@/data/verticals.data";
import type { ApiIndustry } from "@/lib/api/industries";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { resolveIndustryReelMedia } from "@/lib/media/industry";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type CardItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  videoSrc?: string;
  href: string;
};

export type IndustryCardData = Pick<
  ApiIndustry,
  | "slug"
  | "name"
  | "description"
  | "image"
  | "thumbnail"
  | "video"
  | "reel_thumbnail"
  | "reel_video"
>;

function fromIndustry(industry: IndustryCardData): CardItem {
  const reelMedia = resolveIndustryReelMedia(industry);

  return {
    id: industry.slug,
    title: industry.name,
    description: industry.description,
    image: reelMedia.thumbnailSrc ?? industry.image,
    videoSrc: reelMedia.videoSrc,
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

function IndustryCard({
  card,
  isFirst,
  isLast,
}: {
  card: CardItem;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const cardRef = useRef<HTMLAnchorElement>(null);

  const enter = () => {
    setMounted(true);
    setHovered(true);
  };
  const leave = () => setHovered(false);

  // Same fix as InlineVideoPlayer/VideoDialog: a cross-origin iframe (the
  // YouTube provider here) reads its box once and doesn't reliably re-adapt
  // to a later CSS layout pass, so percentage sizing against this card's
  // flex/viewport-derived width could lock in a pillarboxed video. Real,
  // already-settled pixel dimensions sidestep that entirely.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = (rect: { width: number; height: number }) => {
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width <= 0 || height <= 0) return;
      setSize((prev) =>
        prev && prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    };
    measure(el.getBoundingClientRect());
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showVideo = hovered && playing && !!card.videoSrc;
  const shouldMountVideo = !!card.videoSrc && mounted && !!size;

  return (
    <Link
      ref={cardRef}
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
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      {/* Static image */}
      <img
        src={card.image}
        alt={card.title}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-all duration-700",
          showVideo
            ? "scale-105 opacity-0"
            : hovered
              ? "scale-105 opacity-100"
              : "scale-100 opacity-100",
        )}
        draggable={false}
      />

      {/* Video (plays on hover) */}
      {shouldMountVideo && size && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700",
            showVideo ? "opacity-100" : "opacity-0",
          )}
        >
          <ReactPlayer
            src={card.videoSrc}
            playing={hovered}
            muted
            loop
            playsInline
            controls={false}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: size.width,
              height: size.height,
              objectFit: "cover",
            }}
            onPlaying={() => setPlaying(true)}
            onError={() => setPlaying(false)}
          />
        </div>
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
              hovered
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
}

interface Props {
  industries?: IndustryCardData[];
  heading?: HeadingSection | null;
  tone?: "default" | "brand";
  className?: string;
}

export function CoreVerticalsSection({
  industries,
  heading,
  tone = "default",
  className,
}: Props) {
  const cards: CardItem[] = industries?.length
    ? industries.map(fromIndustry)
    : VERTICALS_DATA.map(fromVertical);

  return (
    <section
      className={cn(
        "w-full border-t py-16 sm:py-20 lg:py-24",
        tone === "brand"
          ? "bg-brand-artefact border-primary-foreground/15 dark:border-[#eaeae4]/10"
          : "border-border/40 bg-background",
        className,
      )}
    >
      <div className="container">
        {heading !== null && (
          <ScrollReveal animation="fade-in-up" durationMs={700}>
            <CenteredSectionHeader
              label={heading?.label ?? "Industries"}
              title={heading?.title ?? "Core Verticals"}
              description={
                heading?.description ??
                "We work across a focused set of industries where marketing structure, creative execution, and conversion systems make the biggest difference."
              }
              tone={tone === "brand" ? "inverse" : "default"}
              className="mb-8 lg:mb-10"
            />
          </ScrollReveal>
        )}

        <div className="scrollbar-none flex snap-x snap-mandatory gap-2 overflow-x-auto pb-4 lg:pb-0">
          {cards.map((card, index) => (
            <IndustryCard
              key={card.id}
              card={card}
              isFirst={index === 0}
              isLast={index === cards.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
