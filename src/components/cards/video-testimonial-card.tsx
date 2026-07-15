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
        "bg-card border-border hover:border-primary/40 focus-visible:ring-primary/50 group flex h-full w-80 cursor-pointer flex-col gap-4 rounded-2xl border p-2 text-left transition-all duration-300 select-none focus-visible:ring-2 focus-visible:outline-none md:w-96",
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
          <div className="bg-brand-artefact h-full w-full" />
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
        <div className="border-border/50 relative h-8 w-8 shrink-0 overflow-hidden rounded-full border">
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
          <h5 className="text-foreground poppins text-sm leading-tight font-bold">
            {testimonial.name}
          </h5>
          <p className="text-muted-foreground opensans mt-0.5 text-xs font-normal">
            {testimonial.designation}
          </p>
        </div>
      </div>
    </button>
  );
};
