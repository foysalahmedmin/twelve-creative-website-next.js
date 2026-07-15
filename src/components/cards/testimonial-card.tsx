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
        "bg-card border-border hover:border-primary/40 flex h-full w-96 flex-col justify-between rounded-2xl border p-6 transition-all duration-300 select-none md:w-md md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-4">
        {/* Quote icon */}
        <HugeiconsIcon
          icon={QuoteUpIcon}
          className="text-primary/50 size-8"
        />

        {/* Message */}
        <p className="text-foreground/95 poppins min-h-20 text-sm leading-relaxed font-normal md:text-base">
          {testimonial.message}
        </p>
      </div>

      {/* User info */}
      <div className="mt-6 flex items-center gap-4">
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
          <h4 className="text-foreground poppins text-sm leading-tight font-bold">
            {testimonial.name}
          </h4>
          <p className="text-muted-foreground opensans mt-0.5 text-xs font-normal">
            {testimonial.designation}
          </p>
        </div>
      </div>
    </div>
  );
};
