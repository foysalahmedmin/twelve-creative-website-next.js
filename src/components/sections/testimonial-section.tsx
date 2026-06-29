"use client";

import "swiper/css";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import { VideoTestimonialCard } from "@/components/cards/video-testimonial-card";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import {
  TESTIMONIALS_DATA,
  type TTestimonial,
  type TTestimonialData,
} from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as any;

// ── Arrow nav button ───────────────────────────────────────────────────────
function SliderArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "z-10 hidden shrink-0 items-center justify-center lg:flex",
        "h-10 w-10 rounded-full",
        "border border-border/40 bg-card/50 backdrop-blur-sm",
        "text-foreground/60 transition-all duration-200",
        "hover:border-primary/50 hover:bg-card/80 hover:text-foreground",
        "focus-visible:ring-primary/50 focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
export interface PageTestimonialSectionProps {
  data: TTestimonialData;
  className?: string;
}

// ── Main component ─────────────────────────────────────────────────────────
export const TestimonialSection = ({
  data = TESTIMONIALS_DATA,
  className,
}: Partial<PageTestimonialSectionProps>) => {
  const { label, title, description, testimonials = [] } = data || {};
  const [activeVideo, setActiveVideo] = useState<TTestimonial | null>(null);

  const videoSwiperRef = useRef<SwiperType | null>(null);
  const textSwiperRef = useRef<SwiperType | null>(null);

  const videoTestimonials = testimonials.filter(
    (t) => t.category === "video_message",
  );
  const textTestimonials = testimonials.filter(
    (t) => t.category === "message",
  );

  // Swiper's loop mode needs enough slides to clone from — duplicate short
  // lists so autoplay never runs out of slides to recycle.
  const repeatToFill = <T,>(items: T[], min: number): T[] => {
    if (items.length === 0) return items;
    const copies = Math.max(1, Math.ceil(min / items.length));
    return Array.from({ length: copies }, () => items).flat();
  };
  const videoItems = repeatToFill(videoTestimonials, 12);
  const textItems = repeatToFill(textTestimonials, 12);

  // Swap params.speed to 600 before calling slideNext/slidePrev so the
  // browser transitions from current visual position to the next slide in
  // 600ms (interrupts the slow 9s marquee animation cleanly without needing
  // internal Swiper methods that aren't typed in v12).
  const slide = (
    swiperRef: typeof videoSwiperRef,
    dir: "left" | "right",
  ) => {
    const s = swiperRef.current;
    if (!s) return;
    const originalSpeed = s.params.speed as number;
    s.params.speed = 600;
    s.autoplay?.stop();
    if (dir === "left") s.slideNext();
    else s.slidePrev();
    setTimeout(() => {
      s.params.speed = originalSpeed;
      s.autoplay?.start();
    }, 700);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className={cn("container mt-6 md:mt-10 lg:mt-12", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <div
          className={cn(
            "relative overflow-hidden rounded-[28px] py-10 lg:rounded-[40px] lg:py-16",
            "from-primary/6 via-primary/3 to-primary/4 bg-linear-to-b",
          )}
        >
          {/* Decorative blobs */}
          <div className="bg-primary/5 absolute top-1/4 left-0 h-80 w-80 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute right-0 bottom-1/4 h-80 w-80 translate-x-1/2 rounded-full blur-3xl" />

          {/* Section header */}
          <CenteredSectionHeader
            label={label || "Testimonials"}
            title={title || "What Our Clients Say"}
            description={
              description || "1,000+ creators trust us to edit their videos."
            }
            className="relative z-10 mb-0 lg:mb-0"
          />

          {/* ── Swiper rows ── */}
          <div className="relative z-10 mt-12 flex flex-col gap-10 md:mt-16 md:gap-12">
            {/* ── Row 1: Reels — drift left → right ── */}
            {videoTestimonials.length > 0 && (
              <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12">
                <SliderArrow
                  direction="prev"
                  onClick={() => slide(videoSwiperRef, "left")}
                />

                <div className="min-w-0 flex-1 overflow-hidden">
                  <Swiper
                    className="tc-swiper tc-swiper-reel"
                    modules={[Autoplay]}
                    onSwiper={(s) => {
                      videoSwiperRef.current = s;
                    }}
                    slidesPerView="auto"
                    spaceBetween={14}
                    loop
                    speed={9000}
                    grabCursor
                    autoplay={{
                      delay: 1,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                      reverseDirection: true,
                    }}
                  >
                    {videoItems.map((testimonial, idx) => (
                      <SwiperSlide key={`${testimonial.id}-${idx}`}>
                        <VideoTestimonialCard
                          testimonial={testimonial}
                          onOpen={setActiveVideo}
                          className="w-full md:w-full"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <SliderArrow
                  direction="next"
                  onClick={() => slide(videoSwiperRef, "right")}
                />
              </div>
            )}

            {/* ── Row 2: Text — drift right → left ── */}
            {textTestimonials.length > 0 && (
              <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12">
                <SliderArrow
                  direction="prev"
                  onClick={() => slide(textSwiperRef, "left")}
                />

                <div className="min-w-0 flex-1 overflow-hidden">
                  <Swiper
                    className="tc-swiper tc-swiper-text"
                    modules={[Autoplay]}
                    onSwiper={(s) => {
                      textSwiperRef.current = s;
                    }}
                    slidesPerView="auto"
                    spaceBetween={18}
                    loop
                    speed={11000}
                    grabCursor
                    autoplay={{
                      delay: 1,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                  >
                    {textItems.map((testimonial, idx) => (
                      <SwiperSlide key={`${testimonial.id}-${idx}`}>
                        <TestimonialCard
                          testimonial={testimonial}
                          className="w-full md:w-full"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <SliderArrow
                  direction="next"
                  onClick={() => slide(textSwiperRef, "right")}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* ── Video modal ── */}
      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card/90 animate-zoom-in relative max-h-[85vh] w-auto max-w-[90vw] rounded-3xl border border-white/10 p-2 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="hover:text-primary absolute -top-12 right-0 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              Close (ESC)
            </button>

            <div className="aspect-9/16 h-[min(78vh,720px)] max-w-full overflow-hidden rounded-2xl bg-black">
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
    </section>
  );
};
