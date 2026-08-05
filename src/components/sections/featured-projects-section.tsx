"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { VideoDialog } from "@/components/common/video-dialog";
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
import { ArrowRight02Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";

const ProjectCard = ({
  project,
  onOpen,
}: {
  project: TFeaturedProject;
  onOpen: (project: TFeaturedProject) => void;
}) => (
  <button
    type="button"
    onClick={() => onOpen(project)}
    className={cn(
      "group/project relative block w-full overflow-hidden rounded-lg",
      project.aspect === "reel" ? "aspect-9/16" : "aspect-video",
    )}
    aria-label={`Play ${project.title}`}
  >
    {project.thumbnail_src && (
      <Image
        src={project.thumbnail_src}
        alt={project.title}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 group-hover/project:scale-105"
      />
    )}
    <span
      aria-hidden
      className="bg-foreground/0 group-hover/project:bg-foreground/15 absolute inset-0 transition-colors duration-300"
    />
    <span
      aria-hidden
      className={cn(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center",
        "h-10 w-16 rounded-xl md:h-12 md:w-20 md:rounded-2xl",
        "bg-card/10 border border-white/20 text-white shadow-2xl backdrop-blur-md",
        "group-hover/project:bg-card/30 transition-all duration-300 group-hover/project:scale-110 group-hover/project:border-white/35",
        "group-active/project:scale-95",
      )}
    >
      <HugeiconsIcon
        icon={PlayIcon}
        className="size-5 md:size-6"
        fill="currentColor"
      />
    </span>
  </button>
);

interface FeaturedProjectsSectionProps {
  className?: string;
  data?: TFeaturedIndustryGroup[];
  heading?: HeadingSection | null;
}

export const FeaturedProjectsSection = ({
  className,
  data = [],
  heading,
}: FeaturedProjectsSectionProps) => {
  // Industry tabs are off for now — every group's projects show together in
  // one carousel rather than filtered by industry.
  const projects = data.flatMap((group) => group.projects);
  const [activeProject, setActiveProject] = useState<TFeaturedProject | null>(
    null,
  );

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
                <ProjectCard project={project} onOpen={setActiveProject} />
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

      <VideoDialog
        open={!!activeProject}
        onOpenChange={(next) => {
          if (!next) setActiveProject(null);
        }}
        src={activeProject?.video_src ?? ""}
        title={activeProject?.title ?? "Featured project"}
        aspect={activeProject?.aspect === "reel" ? "9/16" : "16/9"}
      />
    </section>
  );
};
