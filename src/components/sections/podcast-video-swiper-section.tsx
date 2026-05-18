"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { VideoPlayer } from "@/components/common/video-player";
import { cn } from "@/lib/utils";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

interface IVideoItem {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
}

export interface PodcastVideoSwiperProps {
  className?: string;
  data: {
    label?: string;
    title?: string;
    description?: string;
    videos: IVideoItem[];
  };
}

export const PodcastVideoSwiperSection = ({
  className,
  data,
}: PodcastVideoSwiperProps) => {
  const { label, title, description, videos = [] } = data || {};
  return (
    <section
      className={cn(
        "container overflow-hidden py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label={label || "Showcase Reel"}
          title={title || "Featured Production Carousel"}
          description={
            description ||
            "Slide through and click to watch our high-yield promotional content productions."
          }
          className="mb-10 sm:mb-16"
        />
      </ScrollReveal>

      <ScrollReveal
        animation="fade-in-up"
        delayMs={200}
        className="relative mt-8 w-full lg:mt-16"
      >
        <Swiper
          modules={[Autoplay]}
          centeredSlides={true}
          slidesPerView="auto"
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          breakpoints={{
            320: {
              slidesPerView: 1.1,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 1.3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 1.6,
              spaceBetween: 32,
            },
          }}
          className="video-podcast-swiper"
        >
          {videos.map((video) => (
            <SwiperSlide
              key={video.id}
              className="max-w-[733px] overflow-hidden rounded-3xl transition-all duration-300"
            >
              <div className="group/slide-item border-primary/10 relative overflow-hidden rounded-3xl border">
                {/* Embedded dynamic Video Player */}
                <VideoPlayer
                  link={video.url}
                  thumbnail={video.thumbnail}
                  aspectRatio="video"
                />

                {/* Meta details header at bottom */}
                <div className="bg-card/90 border-primary/10 flex items-center justify-between border-t p-4 backdrop-blur-md sm:p-5">
                  <h4 className="font-heading text-foreground truncate text-base font-medium sm:text-lg">
                    {video.title}
                  </h4>
                  <span className="text-primary shrink-0 text-xs font-bold tracking-widest uppercase">
                    Reel {video.id}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </ScrollReveal>

      {/* Slide transformation and custom transition styling */}
      <style>{`
        .video-podcast-swiper .swiper-slide {
          opacity: 0.6;
          transform: scale(0.85);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .video-podcast-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
          z-index: 10;
        }
      `}</style>
    </section>
  );
};

export default PodcastVideoSwiperSection;
