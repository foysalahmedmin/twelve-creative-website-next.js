"use client";

import { TTestimonial } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

type VideoTestimonialCardProps = {
  testimonial: TTestimonial;
  onOpen: (t: TTestimonial) => void;
  className?: string;
};

export const VideoTestimonialCard = ({
  testimonial,
  onOpen,
  className,
}: VideoTestimonialCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onOpen(testimonial)}
      aria-label={`Play video testimonial from ${testimonial.name}`}
      className={cn(
        "group flex h-full w-80 cursor-pointer flex-col gap-4 rounded-2xl border border-[#131C20]/10 bg-[#EAEAE4] p-2 text-left shadow-[0_18px_50px_rgba(19,28,32,0.12)] transition-all duration-300 select-none hover:border-[#131C20]/25 focus-visible:ring-2 focus-visible:ring-[#131C20]/25 focus-visible:outline-none md:w-96",
        className,
      )}
    >
      {/* Video cover aspect-9/16 */}
      <div className="relative aspect-9/16 w-full shrink-0 overflow-hidden rounded-2xl bg-black">
        {testimonial.thumbnail ? (
          <Image
            src={testimonial.thumbnail}
            alt={`${testimonial.name} Video Thumbnail`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <div className="h-full w-full bg-[#131C20]" />
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/35">
          <div className="bg-card/25 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-white shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110">
            <HugeiconsIcon
              icon={PlayIcon}
              className="h-6 w-6 text-white"
              fill="white"
            />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-auto flex min-h-10 items-center gap-2 px-1">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#131C20]/10">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={32}
            height={32}
            className="object-cover"
            draggable={false}
          />
        </div>
        <div className="flex min-w-0 flex-col break-words">
          <h5 className="poppins text-sm leading-tight font-bold text-[#131C20]">
            {testimonial.name}
          </h5>
          <p className="opensans mt-0.5 text-xs font-normal text-[#131C20]/60">
            {testimonial.designation}
          </p>
        </div>
      </div>
    </button>
  );
};
