"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { InlineVideoPlayer } from "@/components/common/inline-video-player";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  type TFeaturedIndustryGroup,
  type TFeaturedProject,
} from "@/data/featured-projects.data";
import { cn } from "@/lib/utils";
import type { HeadingSection } from "@/lib/api/shared-sections";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const ProjectCard = ({ project }: { project: TFeaturedProject }) => (
  <div className="relative w-full overflow-hidden rounded-lg">
    <InlineVideoPlayer
      src={project.video_src}
      title={project.title}
      thumbnailSrc={project.thumbnail_src}
      className={cn(
        "rounded-lg",
        project.aspect === "reel" ? "aspect-9/16" : "aspect-video",
      )}
    />
  </div>
);

interface FeaturedProjectsSectionProps {
  className?: string;
  data: TFeaturedIndustryGroup[];
  heading?: HeadingSection | null;
}

export const FeaturedProjectsSection = ({
  className,
  data,
  heading,
}: FeaturedProjectsSectionProps) => {
  // Industry tabs are off for now — every group's projects show together in
  // one carousel rather than filtered by industry.
  const projects = data.flatMap((group) => group.projects);

  if (!projects.length) return null;

  return (
    <section
      className={cn("bg-muted w-full py-16 sm:py-20 lg:py-24", className)}
    >
      <div className="container">
        {/* Header */}
        {heading !== null && (
          <CenteredSectionHeader
            label={heading?.label ?? "Our Works"}
            title={heading?.title ?? "Featured Projects"}
            description={
              heading?.description ??
              "Real projects that show how strategy, creative, and systems work together."
            }
            className="mb-0 lg:mb-0"
          />
        )}

        {/* Swipe hint (client request) — mobile only, since desktop already
            shows the Previous/Next arrow buttons below and the hint would be
            redundant there. Right-aligned to the carousel's own edge. */}
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-end gap-1.5 px-4 lg:hidden",
            heading === null ? "mt-4" : "mt-6",
          )}
        >
          <span className="text-muted-foreground text-[11px] font-bold tracking-[0.12em] uppercase">
            Swipe to discover
          </span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2.5}
            className="text-muted-foreground motion-safe:animate-nudge-x size-3.5"
          />
        </div>

        {/* Carousel instead of a grid: on mobile the projects sit side-by-side
            and swipe horizontally, so you never scroll a tall column of
            videos. Desktop keeps the same item counts as the old grid. */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className={cn(
            "mx-auto max-w-7xl px-4 lg:px-14",
            heading === null ? "mt-0" : "mt-10 lg:mt-16",
          )}
        >
          <CarouselContent className="-ml-2">
            {projects.map((project) => (
              <CarouselItem
                key={project.id}
                className="basis-full pl-2 sm:basis-1/2 lg:basis-1/4"
              >
                <ProjectCard project={project} />
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
      </div>
    </section>
  );
};
