"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import {
  FEATURED_CATEGORIES,
  type TFeaturedAspect,
  type TFeaturedCategory,
  type TFeaturedProject,
} from "@/data/featured-projects.data";
import { cn } from "@/lib/utils";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const ProjectCard = ({
  project,
  aspect,
}: {
  project: TFeaturedProject;
  aspect: TFeaturedAspect;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="group/project relative w-full overflow-hidden rounded-lg">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          aspect === "reel" ? "aspect-[9/16]" : "aspect-video",
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
  /** Categories to render. Defaults to the static FEATURED_CATEGORIES. */
  data?: TFeaturedCategory[];
}

export const FeaturedProjectsSection = ({
  className,
  data,
}: FeaturedProjectsSectionProps) => {
  const categories = data && data.length ? data : FEATURED_CATEGORIES;
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  if (!categories.length) return null;

  return (
    <section className={cn("container mt-6 md:mt-10 lg:mt-12", className)}>
      {/* Background-gradient wrapper card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] py-10 lg:rounded-[40px] lg:py-16",
          "from-primary/6 via-primary/3 to-primary/4 bg-linear-to-b",
        )}
      >
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
            onValueChange={setActiveId}
            className="mt-5 flex w-full flex-col items-center"
          >
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-10 w-full lg:mt-16"
              >
                <div
                  className={cn(
                    "mx-auto grid max-w-7xl gap-2 px-4",
                    category.aspect === "reel"
                      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
                  )}
                >
                  {category.projects.map((project, idx) => (
                    <ScrollReveal
                      key={project.id}
                      animation="fade-in-up"
                      delayMs={100 * (idx % 4)}
                    >
                      <ProjectCard
                        project={project}
                        aspect={category.aspect}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};
