"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type TFeaturedIndustryGroup,
  type TFeaturedProject,
} from "@/data/featured-projects.data";
import { cn } from "@/lib/utils";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const ProjectCard = ({ project }: { project: TFeaturedProject }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group/project relative w-full overflow-hidden rounded-lg">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          project.aspect === "reel" ? "aspect-9/16" : "aspect-video",
        )}
      >
        {!isPlaying ? (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 z-10 block w-full cursor-pointer"
            aria-label={`Play ${project.title}`}
          >
            <Image
              src={project.thumbnail_src}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover/project:scale-105"
            />
            {/* Hover overlay */}
            <span
              aria-hidden
              className="bg-foreground/0 group-hover/project:bg-foreground/15 absolute inset-0 transition-colors duration-300"
            />
            {/* Play button */}
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
        ) : (
          <div className="absolute inset-0">
            <ReactPlayer
              src={project.video_src}
              controls
              playing
              width="100%"
              height="100%"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface FeaturedProjectsSectionProps {
  className?: string;
  data: TFeaturedIndustryGroup[];
}

export const FeaturedProjectsSection = ({
  className,
  data,
}: FeaturedProjectsSectionProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = data.some((group) => group.id === selectedId)
    ? selectedId!
    : (data[0]?.id ?? "");

  if (!data.length) return null;

  return (
    <section
      className={cn("bg-muted w-full py-16 sm:py-20 lg:py-24", className)}
    >
      <div className="container">
        {/* Header */}
        <CenteredSectionHeader
          label="Our Works"
          title="Featured Projects"
          description="Real projects that show how strategy, creative, and systems work together."
          className="mb-0 lg:mb-0"
        />

        {/* Tabs wrapper */}
        <div className="px-4">
          <Tabs
            value={activeId}
            onValueChange={setSelectedId}
            className="mt-5 flex w-full flex-col items-center"
          >
            {/* Horizontally scrollable on mobile */}
            <div className="scrollbar-none w-full overflow-x-auto pb-1">
              <div className="flex min-w-max justify-center px-2">
                <TabsList>
                  {data.map((industry) => (
                    <TabsTrigger key={industry.id} value={industry.id}>
                      {industry.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            {data.map((industry) => (
              <TabsContent
                key={industry.id}
                value={industry.id}
                className="mt-10 w-full lg:mt-16"
              >
                {/* Carousel instead of a grid: on mobile the projects sit
                    side-by-side and swipe horizontally, so you never scroll a
                    tall column of videos or lose sight of the tabs. Desktop
                    keeps the same item counts as the old grid. */}
                <Carousel
                  opts={{ align: "start" }}
                  className="mx-auto max-w-7xl px-4 lg:px-14"
                >
                  <CarouselContent className="-ml-2">
                    {industry.projects.map((project) => (
                      <CarouselItem
                        key={project.id}
                        className="basis-full pl-2 sm:basis-1/2 lg:basis-1/4"
                      >
                        <ProjectCard project={project} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="left-2 z-20 hidden lg:flex" />
                  <CarouselNext className="right-2 z-20 hidden lg:flex" />
                  <CarouselDots className="mt-6" />
                </Carousel>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};
