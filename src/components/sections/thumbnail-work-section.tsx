"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { VideoDialog } from "@/components/common/video-dialog";
import { cn } from "@/lib/utils";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 8;

/* ─────────────── masonry column balancing ─────────────── */

/* Mirrors the Tailwind sm/lg breakpoints used elsewhere in this file so the
 * masonry column count always matches what's actually on screen. */
function useMasonryColumnCount() {
  const [columns, setColumns] = useState(4);

  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const update = () => setColumns(mqLg.matches ? 4 : mqSm.matches ? 3 : 2);
    update();
    mqSm.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqSm.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return columns;
}

type MasonryItem = IPortfolioItem & { _idx: number };

/* Height of each card relative to a landscape card of the same width — used
 * only to decide which column is currently shortest. Reel (9:16) is ~3.16x
 * taller than landscape (16:9) at equal width. */
const RELATIVE_HEIGHT: Record<
  NonNullable<IPortfolioItem["aspect"]>,
  number
> = {
  reel: 16 / 9,
  landscape: 9 / 16,
};

/* Classic masonry bin-packing: walk the items in order and always drop the
 * next one into whichever column is currently shortest. This is what keeps
 * reel and landscape cards genuinely balanced — CSS multi-column's built-in
 * balancing only works well with dozens of items, not a handful. */
function packMasonryColumns(
  items: IPortfolioItem[],
  columnCount: number,
): MasonryItem[][] {
  const heights = Array<number>(columnCount).fill(0);
  const columns: MasonryItem[][] = Array.from(
    { length: columnCount },
    () => [],
  );

  items.forEach((item, idx) => {
    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }
    columns[shortest].push({ ...item, _idx: idx });
    heights[shortest] += RELATIVE_HEIGHT[item.aspect ?? "landscape"];
  });

  return columns;
}

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
  heading?: HeadingSection | null;
  className?: string;
}

/* ─────────────── single card ─────────────── */

function WorkCard({
  item,
  sizes,
  onOpenVideo,
}: {
  item: IPortfolioItem;
  sizes: string;
  onOpenVideo: (item: IPortfolioItem) => void;
}) {
  const isReel = item.aspect === "reel";
  const hasVideo = !!item.video_link;
  const aspectClassName = isReel ? "aspect-9/16" : "aspect-video";

  const media = (
    <>
      <Image
        src={item.thumbnail}
        alt={item.title ?? "Work"}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-300 group-hover/card:scale-105"
      />
      <span
        aria-hidden
        className="bg-foreground/0 group-hover/card:bg-foreground/15 absolute inset-0 transition-colors duration-300"
      />
      {hasVideo && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
            "h-10 w-16 rounded-xl md:h-12 md:w-20 md:rounded-2xl",
            "bg-card/10 border border-white/20 text-white shadow-2xl backdrop-blur-md",
            "group-hover/card:bg-card/30 transition-all duration-300 group-hover/card:scale-110 group-hover/card:border-white/35",
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
    </>
  );

  if (hasVideo) {
    return (
      <button
        type="button"
        onClick={() => onOpenVideo(item)}
        aria-label={`Play ${item.title ?? "video"}`}
        className={cn(
          "group/card relative block w-full overflow-hidden rounded-2xl",
          aspectClassName,
        )}
      >
        {media}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group/card relative w-full overflow-hidden rounded-2xl",
        aspectClassName,
      )}
    >
      {media}
    </div>
  );
}

/* ─────────────── section ─────────────── */

export const ThumbnailWorkSection = ({
  works,
  showViewMore = true,
  heading,
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

  /* A mixed set of reel (9:16) and landscape (16:9) cards can't share a
   * regular CSS grid: the grid locks every card in a row to that row's
   * tallest card, so the shorter landscape cards leave dead space beneath
   * them. Flow mixed content as a hand-balanced masonry instead — each
   * column packs tight to its own cards' real height, so a short landscape
   * card is immediately followed by the next card rather than empty space. */
  const isMasonry = hasReels && !isShorts && !allReels;
  const columnCount = useMasonryColumnCount();

  /* Uniform grid — only used when every visible card shares one aspect
   * ratio, so row heights already match and a plain grid never gaps. */
  const gridCols = isShorts || allReels
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"; // pure landscape

  /* Reel-grid and masonry columns are both narrow (2/3/4-up); the pure-
   * landscape grid is wider (1/2/3-up). */
  const imageSizes = hasReels
    ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

  /* Load-more state */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleWork = work.slice(0, visibleCount);
  const hasMore = visibleCount < work.length;
  const remaining = work.length - visibleCount;

  const [activeVideo, setActiveVideo] = useState<IPortfolioItem | null>(null);

  const masonryColumns = useMemo(
    () => (isMasonry ? packMasonryColumns(visibleWork, columnCount) : null),
    [isMasonry, visibleWork, columnCount],
  );

  if (!work.length) return null;

  return (
    <section
      className={cn(
        "bg-card border-border/40 w-full border-y py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <div className="relative">
          {heading !== null && (
            <ScrollReveal
              animation="fade-in-up"
              durationMs={800}
              className="relative z-10"
            >
              <CenteredSectionHeader
                label={heading?.label ?? label}
                title={heading?.title ?? title}
                description={heading?.description ?? description}
                className="mb-10 sm:mb-16"
              />
            </ScrollReveal>
          )}

          {/* Grid / masonry */}
          {masonryColumns ? (
            <div
              className={cn(
                "relative z-10 flex gap-4",
                heading === null ? "mt-0" : "mt-10 lg:mt-16",
              )}
            >
              {masonryColumns.map((column, colIdx) => (
                <div key={colIdx} className="flex flex-1 flex-col gap-4">
                  {column.map((item) => (
                    <ScrollReveal
                      key={item.id ?? item._idx}
                      animation="fade-in-up"
                      delayMs={80 * (item._idx % 4)}
                    >
                      <WorkCard
                        item={item}
                        sizes={imageSizes}
                        onOpenVideo={setActiveVideo}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "relative z-10 grid gap-4",
                heading === null ? "mt-0" : "mt-10 lg:mt-16",
                gridCols,
              )}
            >
              {visibleWork.map((item, idx) => (
                <ScrollReveal
                  key={item.id ?? idx}
                  animation="fade-in-up"
                  delayMs={80 * (idx % 4)}
                  className="w-full"
                >
                  <WorkCard
                    item={item}
                    sizes={imageSizes}
                    onOpenVideo={setActiveVideo}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}

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
                  <span className="text-muted-foreground group-hover:text-primary-foreground text-xs tabular-nums transition-colors">
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

      <VideoDialog
        open={!!activeVideo}
        onOpenChange={(next) => {
          if (!next) setActiveVideo(null);
        }}
        src={activeVideo?.video_link ?? ""}
        title={activeVideo?.title ?? "Work"}
        aspect={activeVideo?.aspect === "reel" ? "9/16" : "16/9"}
      />
    </section>
  );
};

export default ThumbnailWorkSection;
