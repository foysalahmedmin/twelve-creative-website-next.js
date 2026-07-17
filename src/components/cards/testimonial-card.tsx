"use client";

import { TTestimonial } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import { QuoteUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
        "flex h-full w-96 flex-col justify-between rounded-2xl border border-[#131C20]/10 bg-[#EAEAE4] p-6 shadow-[0_18px_50px_rgba(19,28,32,0.12)] transition-all duration-300 select-none hover:border-[#131C20]/25 md:w-md md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Quote icon */}
        <HugeiconsIcon icon={QuoteUpIcon} className="text-primary/50 size-8" />

        {/* Message */}
        <p className="poppins min-h-20 text-sm leading-relaxed font-normal text-[#131C20]/85 md:text-base">
          {testimonial.message}
        </p>
      </div>

      {/* User info */}
      <div className="mt-6 flex items-center gap-4">
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
          <h4 className="poppins text-sm leading-tight font-bold text-[#131C20]">
            {testimonial.name}
          </h4>
          <p className="opensans mt-0.5 text-xs font-normal text-[#131C20]/60">
            {testimonial.designation}
          </p>
        </div>
      </div>
    </div>
  );
};
