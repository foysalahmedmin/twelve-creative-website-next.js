"use client";

import { InsightCard } from "@/components/cards/insight-card";
import { CenteredSectionHeader } from "@/components/common/section-label";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  INSIGHTS_DATA,
  INSIGHTS_SECTION_LIMIT,
  type TInsightCardItem,
} from "@/data/insights.data";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

interface InsightsSectionProps {
  className?: string;
  /** Latest published insights. Falls back to the demo set when empty. */
  data?: TInsightCardItem[];
  heading?: HeadingSection | null;
  /** How many cards to show before the carousel starts scrolling. */
  limit?: number;
}

export const InsightsSection = ({
  className,
  data,
  heading,
  limit = INSIGHTS_SECTION_LIMIT,
}: InsightsSectionProps) => {
  const source = data && data.length ? data : INSIGHTS_DATA.insights;
  const insights = source.slice(0, limit);

  if (!insights.length) return null;

  return (
    <section
      className={
        className ?? "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24"
      }
    >
      <div className="container">
        {heading !== null && (
          <CenteredSectionHeader
            label={heading?.label ?? INSIGHTS_DATA.label}
            title={heading?.title ?? INSIGHTS_DATA.title}
            description={heading?.description ?? INSIGHTS_DATA.description}
            className="mb-0 lg:mb-0"
          />
        )}

        {/* Swipe hint — mobile only. Desktop gets the arrow buttons instead,
            matching FeaturedProjectsSection. */}
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-end gap-1.5 px-4 lg:hidden">
          <span className="text-muted-foreground text-[11px] font-bold tracking-[0.12em] uppercase">
            Swipe to read
          </span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2.5}
            className="text-muted-foreground motion-safe:animate-nudge-x size-3.5"
          />
        </div>

        <Carousel
          opts={{ align: "start", loop: insights.length > 3 }}
          className="mx-auto mt-6 max-w-7xl px-4 lg:mt-10 lg:px-14"
        >
          <CarouselContent className="-ml-4">
            {insights.map((insight) => (
              <CarouselItem
                key={insight._id ?? insight.slug}
                className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <InsightCard
                  item={insight}
                  className="h-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            variant="default"
            className="left-2 z-20 hidden lg:flex"
          />
          <CarouselNext
            variant="default"
            className="right-2 z-20 hidden lg:flex"
          />
          <CarouselDots className="mt-6" />
        </Carousel>

        <div className="mt-8 flex justify-center">
          <Link
            href="/insights"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[0.04em] uppercase transition-colors"
          >
            Read all insights
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              strokeWidth={2.5}
              className="size-4"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
