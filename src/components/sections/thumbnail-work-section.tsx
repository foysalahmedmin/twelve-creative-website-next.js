"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const PAGE_SIZE = 8;

/* ─────────────── types ─────────────── */

export interface IPortfolioItem {
  id?: string;
  thumbnail: string;
  video_link?: string | null;
  title?: string;
  /** Controls card shape. Defaults to "landscape" when omitted. */
  aspect?: "reel" | "landscape";
}

export interface ThumbnailWorkSectionProps {
  works: {
    label: string;
    title: string;
    description: string;
    type?: "standard" | "shortsreels-editing";
    work: IPortfolioItem[];
  };
  /** @deprecated Showcase filtering is relational; the Works page has no category query. */
  slug?: string;
  showViewMore?: boolean;
  className?: string;
}

/* ─────────────── single card ─────────────── */

function WorkCard({ item }: { item: IPortfolioItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const isReel = item.aspect === "reel";
  const hasVideo = !!item.video_link;

  return (
    <div className="group/card relative w-full overflow-hidden rounded-2xl">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          isReel ? "aspect-9/16" : "aspect-video",
        )}
      >
        {hasVideo && isPlaying ? (
          /* ── Active player ── */
          <div className="absolute inset-0">
            <ReactPlayer
              src={item.video_link!}
              controls
              playing
              width="100%"
              height="100%"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          /* ── Thumbnail + play button ── */
          <button
            type="button"
            onClick={hasVideo ? () => setIsPlaying(true) : undefined}
            className={cn(
              "absolute inset-0 z-10 block w-full",
              hasVideo ? "cursor-pointer" : "cursor-default",
            )}
            aria-label={hasVideo ? `Play ${item.title ?? "video"}` : undefined}
          >
            {/* Thumbnail image */}
            <Image
              src={item.thumbnail}
              alt={item.title ?? "Work"}
              fill
              sizes={
                isReel
                  ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-300 group-hover/card:scale-105"
            />

            {/* Dark hover scrim */}
            <span
              aria-hidden
              className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover/card:bg-foreground/15"
            />

            {/* Glass play button — only shown when there's a video */}
            {hasVideo && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
                  "h-10 w-16 rounded-xl md:h-12 md:w-20 md:rounded-2xl",
                  "border border-white/20 bg-card/10 text-white shadow-2xl backdrop-blur-md",
                  "transition-all duration-300",
                  "group-hover/card:scale-110 group-hover/card:border-white/35 group-hover/card:bg-card/30",
                  "group-active/card:scale-95",
                )}
              >
                <HugeiconsIcon
                  icon={PlayIcon}
                  className="size-5 md:size-6"
                  fill="currentColor"
                />
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────── section ─────────────── */

export const ThumbnailWorkSection = ({
  works,
  showViewMore = true,
  className,
}: ThumbnailWorkSectionProps) => {
  const {
    label,
    title,
    description,
    type = "standard",
    work = [],
  } = works || {};

  const isShorts = type === "shortsreels-editing";

  /* Detect whether any item is a reel — if so we render a mixed/reel grid */
  const hasReels = work.some((w) => w.aspect === "reel");
  const allReels = work.every((w) => w.aspect === "reel");

  /* Load-more state */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleWork = work.slice(0, visibleCount);
  const hasMore = visibleCount < work.length;
  const remaining = work.length - visibleCount;

  if (!work.length) return null;

  /* Grid columns:
   *  - explicit "shortsreels-editing" type → same narrow columns as before
   *  - all reels → narrow columns (portrait cards)
   *  - all landscape → wide 3-col
   *  - mixed (some reel, some landscape) → masonry-like: reels get 1 col,
   *    landscapes get 2 cols via CSS grid span. We use a 6-column base grid
   *    and span each card individually.
   */
  const gridCols = (() => {
    if (isShorts || allReels) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    if (!hasReels) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    // mixed — 6-column base so reels take 1 unit and landscapes take 2
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
  })();

  return (
    <section
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <div className="bg-card border-border relative overflow-hidden rounded-3xl border p-8 sm:p-12 lg:p-16">
          <ScrollReveal
            animation="fade-in-up"
            durationMs={800}
            className="relative z-10"
          >
            <CenteredSectionHeader
              label={label}
              title={title}
              description={description}
              className="mb-10 sm:mb-16"
            />
          </ScrollReveal>

          {/* Grid */}
          <div
            className={cn(
              "relative z-10 mt-10 grid gap-4 lg:mt-16",
              gridCols,
            )}
          >
            {visibleWork.map((item, idx) => {
              const isReel = item.aspect === "reel";

              /* In a mixed grid each landscape card spans 2 of the 6 columns
                 and each reel spans 1 column so portrait cards stay narrow. */
              const spanClass =
                hasReels && !isShorts && !allReels
                  ? isReel
                    ? "" // 1 col
                    : "col-span-2"
                  : "";

              return (
                <ScrollReveal
                  key={item.id ?? idx}
                  animation="fade-in-up"
                  delayMs={80 * (idx % 4)}
                  className={cn("w-full", spanClass)}
                >
                  <WorkCard item={item} />
                </ScrollReveal>
              );
            })}
          </div>

          {/* Load More — shown when there are more items beyond PAGE_SIZE */}
          {(hasMore || showViewMore) && (
            <div className="relative z-10 mt-12 flex flex-col items-center gap-4">
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className={cn(
                    "group inline-flex items-center gap-2.5",
                    "border-border hover:border-primary bg-card rounded-xl border px-6 py-3",
                    "text-sm font-semibold tracking-wide transition-all duration-200",
                    "hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95",
                  )}
                >
                  Load More
                  <span className="text-muted-foreground group-hover:text-primary-foreground tabular-nums text-xs transition-colors">
                    +{Math.min(PAGE_SIZE, remaining)}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </button>
              )}

              {showViewMore && (
                <Link
                  href="/works"
                  className="bg-primary text-primary-foreground rounded-lg px-6 py-3 text-center text-sm font-semibold tracking-[0.05em] uppercase transition-transform duration-200 select-none hover:scale-105 active:scale-95"
                >
                  View More
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ThumbnailWorkSection;
