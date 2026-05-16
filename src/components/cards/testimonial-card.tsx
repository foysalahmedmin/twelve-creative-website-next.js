"use client";

import { TTestimonial } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TestimonialCardProps = {
  testimonial: TTestimonial;
  className?: string;
};

export const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  return (
    <div className={cn(
      "bg-muted/30 border-border/50 relative h-full overflow-hidden rounded-[0.75em] border p-[2em] lg:p-[2.5em]",
      className
    )}>
      {/* Quote Icon */}
      <div className="absolute top-0 left-0 p-[1em] opacity-10">
        <svg
          width="40"
          height="36"
          viewBox="0 0 53 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[2.25em] w-[2.5em]"
        >
          <path
            d="M19.5073 27.3911V48.5156H0V31.8384C0 22.8091 1.07812 16.2729 3.23438 12.23C6.06445 6.83936 10.5454 2.7627 16.6772 0L21.1245 7.0752C17.4185 8.625 14.6895 10.9497 12.9375 14.0493C11.1855 17.0815 10.2085 21.5288 10.0063 27.3911H19.5073ZM50.8403 27.3911V48.5156H31.333V31.8384C31.333 22.8091 32.4111 16.2729 34.5674 12.23C37.3975 6.83936 41.8784 2.7627 48.0103 0L52.4575 7.0752C48.7515 8.625 46.0225 10.9497 44.2705 14.0493C42.5186 17.0815 41.5415 21.5288 41.3394 27.3911H50.8403Z"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>

      {/* Feedback Text */}
      <p className="text-foreground relative z-10 text-[1em] leading-relaxed font-medium lg:text-[1.125em]">
        "{testimonial.feedback}"
      </p>

      {/* User Info */}
      <div className="mt-[2em] flex items-center gap-[0.75em]">
        <div className="border-border relative h-[2.75em] w-[2.75em] overflow-hidden rounded-full border shadow-sm">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h6 className="text-foreground text-[0.875em] font-bold">
            {testimonial.name}
          </h6>
          <p className="text-muted-foreground text-[0.625em] font-bold tracking-wider uppercase">
            Patient
          </p>
        </div>
      </div>
    </div>
  );
};
