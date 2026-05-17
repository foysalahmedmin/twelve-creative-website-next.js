"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export interface ITestimonial {
  id?: string;
  name: string;
  designation: string;
  image: string;
  video_message?: string;
  message?: string;
  category: "message" | "video_message";
  type: string;
}

export interface ServiceTestimonialProps {
  title: string;
  description: string;
  data: ITestimonial[];
  className?: string;
}

// ── Testimonial Text Message Card ──────────────────────
const TestimonialMessageCard = ({ testimonial }: { testimonial: ITestimonial }) => {
  return (
    <div className="w-[320px] sm:w-[440px] h-[280px] p-[1px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 rounded-[28px] shrink-0 mx-4 transition-all duration-300 hover:scale-[102%]">
      <div className="rounded-[27px] bg-card w-full h-full p-6 flex flex-col justify-between">
        
        {/* Quote comma indicator */}
        <div className="size-10 relative shrink-0">
          <svg
            className="w-full h-full text-primary/25 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M9.9 19c-1.8 0-3.3-1.5-3.3-3.3 0-1 .4-2 1.2-2.7C6.6 11.2 6 8.5 6 5.5h3c0 2 .5 3.5 1.5 4.5.8.8 1.4 1.8 1.4 3 0 1.8-1.5 3.3-3.3 3.3m8.1 0c-1.8 0-3.3-1.5-3.3-3.3 0-1 .4-2 1.2-2.7-1.2-1.8-1.8-4.5-1.8-7.5h3c0 2 .5 3.5 1.5 4.5.8.8 1.4 1.8 1.4 3 0 1.8-1.5 3.3-3.3 3.3" />
          </svg>
        </div>

        {/* Quote body text */}
        <p className="text-foreground/90 text-sm sm:text-base leading-relaxed line-clamp-4 font-medium flex-1 pt-2 overflow-y-auto">
          {testimonial.message}
        </p>

        {/* Profile Info */}
        <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-primary/10">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground truncate">
              {testimonial.name}
            </h4>
            <p className="text-muted-foreground text-xs sm:text-sm truncate">
              {testimonial.designation}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Testimonial Video Reel Card ────────────────────────
const TestimonialVideoCard = ({ testimonial }: { testimonial: ITestimonial }) => {
  return (
    <div className="w-[280px] sm:w-[320px] h-[550px] p-[1px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 rounded-[28px] shrink-0 mx-4 transition-all duration-300 hover:scale-[102%]">
      <div className="rounded-[27px] bg-card w-full h-full p-4 flex flex-col justify-between">
        
        {/* Video Player wrapper (16:9 vertical portrait style) */}
        <div className="relative w-full aspect-[9/14] rounded-2xl overflow-hidden border border-primary/10 bg-black">
          <ReactPlayer
            url={testimonial.video_message}
            width="100%"
            height="100%"
            controls={true}
            playsinline
            light={testimonial.image} // lazy load thumbnail
            playIcon={
              <button className="w-14 h-9 rounded-xl bg-primary text-white border border-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 duration-200 transition-transform absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Play fill="#fff" strokeWidth={0} className="w-5 h-5" />
              </button>
            }
          />
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-3.5 pt-4">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-primary/10">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-foreground truncate">
              {testimonial.name}
            </h4>
            <p className="text-muted-foreground text-xs sm:text-sm truncate">
              {testimonial.designation}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ── Main Marquee Coordinator ────────────────────────────
export const ServiceTestimonial = ({ title, description, data = [], className }: ServiceTestimonialProps) => {
  const videoTestimonials = data.filter((item) => item.category === "video_message");
  const textTestimonials = data.filter((item) => item.category === "message");

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24 overflow-hidden", className)}>
      <div className="rounded-[40px] overflow-hidden bg-gradient-to-b from-[#fff5f0] to-[#fcece4] dark:from-primary/10 dark:to-primary/5 py-[60px] relative">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="Testimonials"
            title={title}
            description={description}
            className="mb-10 sm:mb-16"
          />
        </ScrollReveal>

        {/* Scrolling Marquees */}
        <div className="w-full space-y-5 mt-10 lg:mt-16">
          
          {/* Row 1: Video Marquee */}
          {videoTestimonials.length > 0 && (
            <ScrollReveal animation="fade-in-up" delayMs={100} className="w-full">
              <Marquee
                gradient={true}
                gradientColor="#fff5f0"
                gradientWidth={100}
                pauseOnHover={true}
                speed={25}
                className="overflow-hidden"
              >
                {videoTestimonials.map((item, idx) => (
                  <TestimonialVideoCard key={idx} testimonial={item} />
                ))}
              </Marquee>
            </ScrollReveal>
          )}

          {/* Row 2: Text Marquee */}
          {textTestimonials.length > 0 && (
            <ScrollReveal animation="fade-in-up" delayMs={250} className="w-full">
              <Marquee
                gradient={true}
                gradientColor="#fff5f0"
                gradientWidth={100}
                pauseOnHover={true}
                speed={20}
                className="overflow-hidden mt-5 h-80"
              >
                {textTestimonials.map((item, idx) => (
                  <TestimonialMessageCard key={idx} testimonial={item} />
                ))}
              </Marquee>
            </ScrollReveal>
          )}

        </div>
      </div>
    </section>
  );
};

export default ServiceTestimonial;
