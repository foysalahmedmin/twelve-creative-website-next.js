import Image from "next/image";
import { cn } from "@/lib/utils";

interface FounderSectionProps {
  className?: string;
  imageSrc?: string;
}

export const FounderSection = ({ className, imageSrc }: FounderSectionProps) => {
  return (
    <section className={cn("bg-background py-16 sm:py-24 lg:py-32", className)}>
      <div className="container max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">

          {/* Left: Name + Title + Bio */}
          <div className="flex-1 space-y-8">
            {/* Eyebrow */}
            <span className="border-primary/20 bg-primary/8 text-primary inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-normal uppercase tracking-[0.075em]">
              Founder & Owner
            </span>

            {/* Large name — PP Object Sans Heavy */}
            <div className="space-y-2">
              <h2 className="font-heading text-foreground text-[56px] font-black leading-[100%] tracking-tight sm:text-[72px] lg:text-[90px]">
                Carlos
              </h2>
              <h2 className="font-heading text-primary text-[56px] font-black leading-[100%] tracking-tight sm:text-[72px] lg:text-[90px]">
                Doce.
              </h2>
            </div>

            {/* Title */}
            <p className="text-muted-foreground text-sm font-normal uppercase tracking-[0.075em]">
              Owner — Twelve Creative
            </p>

            {/* Bio */}
            <div className="border-primary/20 border-l-2 pl-6 space-y-4">
              <p className="text-foreground/80 text-base leading-[170%] font-medium sm:text-lg">
                Carlos built Twelve Creative from the belief that most businesses
                don't have a creative problem — they have a strategy problem
                disguised as one. He combines the analytical rigor of growth
                systems with the visual instincts of a creative director.
              </p>
              <p className="text-muted-foreground text-base leading-[170%]">
                Every project at Twelve Creative reflects his core conviction:
                that positioning, creative, and execution must exist in the same
                room — not across three different agencies.
              </p>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative w-full max-w-sm shrink-0 lg:w-96">
            <div className="border-primary/15 bg-card relative overflow-hidden rounded-[32px] border aspect-[3/4] w-full">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Carlos Doce — Founder, Twelve Creative"
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="bg-primary/20 flex h-24 w-24 items-center justify-center rounded-full">
                    <span className="font-heading text-primary text-4xl font-black">CD</span>
                  </div>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest">
                    Photo coming soon
                  </p>
                </div>
              )}
            </div>

            {/* Accent decoration */}
            <div className="bg-primary/20 pointer-events-none absolute -bottom-4 -right-4 h-48 w-48 rounded-full blur-[60px]" />
          </div>
        </div>
      </div>
    </section>
  );
};
