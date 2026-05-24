"use client";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { VideoTestimonialCard } from "@/components/cards/video-testimonial-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { TESTIMONIALS_DATA, type TTestimonial, type TTestimonialData } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as any;

export interface PageTestimonialSectionProps {
  data: TTestimonialData;
  className?: string;
}

export const TestimonialSection = ({ data = TESTIMONIALS_DATA, className }: Partial<PageTestimonialSectionProps>) => {
  const { label, title, description, testimonials = [] } = data || {};
  const [activeVideo, setActiveVideo] = useState<TTestimonial | null>(null);

  // Filter video & text reviews
  const videoTestimonials = testimonials.filter(
    (t) => t.category === "video_message",
  );
  const textTestimonials = testimonials.filter(
    (t) => t.category === "message",
  );

  // Handle escape key to close video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className={cn("container mt-6 md:mt-10 lg:mt-12", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        {/* Background-gradient wrapper card exactly like Our Works */}
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] py-10 lg:rounded-[40px] lg:py-16",
            "from-primary/6 via-primary/3 to-primary/4 bg-linear-to-b",
          )}
        >
          {/* Decorative backdrop shapes inside container */}
          <div className="bg-primary/5 absolute top-1/4 left-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute right-0 bottom-1/4 h-80 w-80 translate-x-1/2 rounded-full blur-3xl" />

          {/* Header styled exactly like Our Works */}
          <CenteredSectionHeader
            label={label || "Testimonials"}
            title={title || "What Our Clients Say"}
            description={description || "1,000+ creators trust us to edit their videos."}
            className="relative z-10 mb-0 lg:mb-0"
          />

          {/* Dynamic Double Marquees */}
          <div className="relative z-10 mt-12 flex flex-col gap-8 md:mt-16 md:gap-12 md:px-12 xl:px-16">
            {/* Row 1: Video reviews (moves Left) */}
            {videoTestimonials.length > 0 && (
              <div className="relative w-full">
                {/* Fade edges */}
                <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-16 bg-gradient-to-r from-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-16 bg-gradient-to-l from-transparent to-transparent" />

                <Marquee
                  gradient={false}
                  speed={35}
                  pauseOnHover
                  direction="left"
                  className="flex gap-6 py-4"
                >
                  {[...videoTestimonials, ...videoTestimonials].map(
                    (testimonial, idx) => (
                      <div
                        key={`${testimonial.id}-vid-${idx}`}
                        className="mx-3"
                      >
                        <VideoTestimonialCard
                          testimonial={testimonial}
                          onOpen={setActiveVideo}
                        />
                      </div>
                    ),
                  )}
                </Marquee>
              </div>
            )}

            {/* Row 2: Text reviews (moves Right) */}
            {textTestimonials.length > 0 && (
              <div className="relative w-full">
                {/* Fade edges */}
                <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-20 w-16 bg-gradient-to-r from-transparent to-transparent" />
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-20 w-16 bg-gradient-to-l from-transparent to-transparent" />

                <Marquee
                  gradient={false}
                  speed={30}
                  pauseOnHover
                  direction="right"
                  className="flex gap-6 py-4"
                >
                  {[...textTestimonials, ...textTestimonials].map(
                    (testimonial, idx) => (
                      <div
                        key={`${testimonial.id}-txt-${idx}`}
                        className="mx-3"
                      >
                        <TestimonialCard testimonial={testimonial} />
                      </div>
                    ),
                  )}
                </Marquee>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      <div>
        {/* Video Modal Overlay */}
        {activeVideo && (
          <div
            onClick={() => setActiveVideo(null)}
            className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-card/90 animate-zoom-in relative w-full max-w-md rounded-3xl border border-white/10 p-2 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveVideo(null)}
                className="hover:text-primary absolute -top-12 right-0 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                Close (ESC)
              </button>

              {/* React Player Container */}
              <div className="aspect-[9/16] w-full overflow-hidden rounded-2xl bg-black">
                <ReactPlayer
                  src={activeVideo.video_message || ""}
                  playing
                  controls
                  width="100%"
                  height="100%"
                  playsinline
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
