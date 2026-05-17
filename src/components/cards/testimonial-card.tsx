"use client";

import { TTestimonial } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TestimonialCardProps = {
  testimonial: TTestimonial;
  className?: string;
};

export const TestimonialCard = ({
  testimonial,
  className,
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        "bg-card/25 border-border/40 hover:border-primary/30 flex w-96 flex-col justify-between rounded-3xl border p-6 ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 select-none md:w-md md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Quote comma */}
        <div className="relative h-8 w-8 opacity-45">
          <Image
            src="/assets/comma.png"
            alt="Quote"
            width={32}
            height={32}
            className="object-contain"
            draggable={false}
          />
        </div>

        {/* Message */}
        <p className="text-foreground/95 poppins min-h-[80px] text-sm leading-relaxed font-normal md:text-base">
          {testimonial.message}
        </p>
      </div>

      {/* User info */}
      <div className="mt-6 flex items-center gap-4">
        <div className="border-border/50 relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={48}
            height={48}
            className="object-cover"
            draggable={false}
          />
        </div>
        <div className="flex flex-col">
          <h4 className="text-foreground poppins text-sm leading-tight font-bold md:text-[16px]">
            {testimonial.name}
          </h4>
          <p className="text-muted-foreground opensans mt-1 text-xs font-normal">
            {testimonial.designation}
          </p>
        </div>
      </div>
    </div>
  );
};
