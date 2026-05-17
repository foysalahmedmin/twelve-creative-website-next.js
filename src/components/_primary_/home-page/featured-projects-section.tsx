"use client";

import {
  FEATURED_CATEGORIES,
  type TFeaturedProject,
  type TFeaturedAspect,
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
                "h-10 w-14 rounded-lg backdrop-blur-[2px] md:h-10 md:w-16 md:rounded-xl",
                "from-primary-from/85 to-primary-to/85 text-primary-foreground bg-linear-to-br",
                "ring-1 ring-primary-foreground/30 shadow-lg",
                "transition-transform duration-200 group-hover/project:scale-105 group-active/project:scale-95",
              )}
            >
              <HugeiconsIcon
                icon={PlayIcon}
                className="size-4 md:size-6"
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

export const FeaturedProjectsSection = ({
  className,
}: {
  className?: string;
}) => {
  const [activeId, setActiveId] = useState(FEATURED_CATEGORIES[0].id);
  const activeCategory =
    FEATURED_CATEGORIES.find((c) => c.id === activeId) ??
    FEATURED_CATEGORIES[0];

  return (
    <section className={cn("container mt-6 md:mt-10 lg:mt-[3.125rem]", className)}>
      {/* Background-gradient wrapper card */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[28px] py-10 lg:rounded-[40px] lg:py-16",
          "from-primary/6 via-primary/3 to-primary/4 bg-linear-to-b",
        )}
      >
        {/* Header */}
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-1 px-4">
          {/* Glass pill label */}
          <span
            className={cn(
              "text-foreground/80 inline-flex items-center justify-center rounded-3xl px-5 py-2.5",
              "bg-card/45 ring-foreground/10 backdrop-blur-md ring-1",
              "text-base font-normal leading-[140%]",
              "shadow-[inset_0_1px_0_var(--color-card),0_2px_6px_-2px_var(--color-foreground)/8%]",
            )}
          >
            Our Works
          </span>

          <h2 className="font-heading text-foreground mt-2 text-center text-[36px] font-medium leading-[120%] tracking-tight md:text-[56px] xl:mt-4">
            Featured Projects
          </h2>

          <p className="text-muted-foreground mx-auto mt-2 w-full text-center text-sm font-normal leading-[150%] md:text-base xl:w-8/9">
            Real projects that show how strategy, creative, and systems work
            together.
          </p>
        </div>

        {/* Tabs container — glass */}
        <div className="px-4">
          <div
            className={cn(
              "mx-auto mt-5 flex items-center overflow-x-auto rounded-[12px] px-3 py-3",
              "bg-card/40 ring-foreground/10 backdrop-blur-2xl ring-1",
              "shadow-[0_8px_24px_-12px] shadow-primary/10",
              "h-[75px] gap-2 sm:max-w-[594px]",
              "justify-start lg:justify-center",
              "no-scrollbar cursor-grab",
            )}
          >
            {FEATURED_CATEGORIES.map((category) => {
              const isActive = category.id === activeId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  className={cn(
                    "h-[51px] whitespace-nowrap rounded-[12px] px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "from-primary-from to-primary-to text-primary-foreground bg-linear-to-br font-semibold shadow-md"
                      : "text-foreground/70 hover:text-foreground hover:bg-card/60",
                  )}
                  aria-pressed={isActive}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div
          className={cn(
            "mx-auto mt-10 grid max-w-7xl gap-2 px-4 lg:mt-16",
            activeCategory.aspect === "reel"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {activeCategory.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              aspect={activeCategory.aspect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
