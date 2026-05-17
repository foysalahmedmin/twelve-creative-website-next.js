"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { VideoPlayer } from "@/components/common/video-player";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";

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
  videos?: IVideoItem[];
}

const DEFAULT_VIDEOS: IVideoItem[] = [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=432&fit=crop&auto=format",
    title: "Cinematic Commercial Pitch Film",
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=432&fit=crop&auto=format",
    title: "High-Growth Software Explainer",
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=432&fit=crop&auto=format",
    title: "Omnichannel Founder Direct-to-Camera",
  },
];

export const PodcastVideoSwiper = ({ className, videos = DEFAULT_VIDEOS }: PodcastVideoSwiperProps) => {
  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24 overflow-hidden", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label="Showcase Reel"
          title="Featured Production Carousel"
          description="Slide through and click to watch our high-yield promotional content productions."
          className="mb-10 sm:mb-16"
        />
      </ScrollReveal>

      <ScrollReveal animation="fade-in-up" delayMs={200} className="w-full relative mt-8 lg:mt-16">
        <Swiper
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
            <SwiperSlide key={video.id} className="max-w-[733px] rounded-3xl overflow-hidden transition-all duration-300">
              <div className="relative group/slide-item rounded-3xl overflow-hidden border border-primary/10">
                {/* Embedded dynamic Video Player */}
                <VideoPlayer
                  link={video.url}
                  thumbnail={video.thumbnail}
                  aspectRatio="video"
                />
                
                {/* Meta details header at bottom */}
                <div className="p-4 sm:p-5 bg-card/90 backdrop-blur-md border-t border-primary/10 flex justify-between items-center">
                  <h4 className="font-heading font-medium text-base sm:text-lg text-foreground truncate">
                    {video.title}
                  </h4>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest shrink-0">
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

export default PodcastVideoSwiper;
