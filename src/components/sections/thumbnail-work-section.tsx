"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { VideoPlayer } from "@/components/common/video-player";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface IPortfolioItem {
  id?: string;
  thumbnail: string;
  video_link?: string | null;
  title?: string;
}

export interface ThumbnailWorkSectionProps {
  works: {
    tag: string;
    heading_part1: string;
    paragraph: string;
    type?: "standard" | "shortsreels-editing";
    work: IPortfolioItem[];
  };
  slug?: string;
  className?: string;
}

export const ThumbnailWorkSection = ({ works, slug = "all", className }: ThumbnailWorkSectionProps) => {
  const { tag, heading_part1, paragraph, type = "standard", work = [] } = works || {};

  const isShorts = type === "shortsreels-editing";

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <div className="rounded-[40px] overflow-hidden bg-gradient-to-b from-[#fff5f0] to-[#fcece4] dark:from-primary/10 dark:to-primary/5 p-8 sm:p-12 lg:p-16 relative">
        <ScrollReveal animation="fade-in-up" durationMs={800} className="relative z-10">
          <CenteredSectionHeader
            label={tag}
            title={heading_part1}
            description={paragraph}
            className="mb-10 sm:mb-16"
          />
        </ScrollReveal>

        {/* Grid containing work portfolios */}
        <div
          className={cn(
            "grid gap-4 mt-10 lg:mt-16 relative z-10",
            isShorts
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {work.map((item, idx) => {
            const hasVideo = !!item.video_link;

            return (
              <ScrollReveal
                key={idx}
                animation="fade-in-up"
                delayMs={100 * (idx % 3)}
                className="w-full"
              >
                {hasVideo ? (
                  <div className={cn("overflow-hidden rounded-xl", isShorts ? "aspect-[9/16]" : "aspect-auto")}>
                    <VideoPlayer
                      link={item.video_link!}
                      thumbnail={item.thumbnail}
                      aspectRatio={isShorts ? "shorts" : "video"}
                    />
                  </div>
                ) : (
                  <div className={cn("relative overflow-hidden w-full max-w-[410px] mx-auto rounded-[13px] transition-transform duration-300 hover:scale-105", isShorts ? "aspect-[9/16]" : "aspect-video max-h-[308px]")}>
                    <Image
                      src={item.thumbnail}
                      alt={item.title || "Graphic artwork"}
                      fill
                      sizes="(max-width: 768px) 100vw, 410px"
                      className="object-cover"
                    />
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
        
        {/* Redirect trigger */}
        <div className="mt-16 flex justify-center items-center relative z-10">
          <Link
            href={`/work?cat=${slug}`}
            className="px-6 py-4 rounded-xl bg-primary text-white font-medium text-center hover:scale-105 active:scale-95 duration-200 transition-transform select-none"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailWorkSection;
