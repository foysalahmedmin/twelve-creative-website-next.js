import { cn } from "@/lib/utils";
import Image from "next/image";

interface FounderSectionProps {
  className?: string;
  imageSrc?: string;
}

export const FounderSection = ({
  className,
  imageSrc,
}: FounderSectionProps) => {
  return (
    <section
      className={cn(
        "bg-background border-border/40 border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Left: Name + Title + Bio */}
          <div className="flex-1 space-y-8">
            {/* Eyebrow */}
            {/* <span className="text-foreground border-foreground/25 inline-flex items-center rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
              Founder & Owner
            </span> */}

            {/* Large name — PP Object Sans Heavy */}
            <div className="space-y-2 space-x-1">
              <h2 className="font-heading text-foreground inline-block text-[56px] leading-[100%] font-black tracking-tight sm:text-[72px] lg:text-[90px]">
                Carlos
              </h2>{" "}
              <h2 className="font-heading text-primary inline-block text-[56px] leading-[100%] font-black tracking-tight sm:text-[72px] lg:text-[90px]">
                Doce.
              </h2>
            </div>

            {/* Title */}
            <p className="text-muted-foreground text-sm font-normal tracking-[0.075em] uppercase">
              Owner — Twelve Creative
            </p>

            <div className="relative w-full max-w-sm shrink-0 lg:hidden">
              <div className="border-border bg-card relative aspect-square w-full overflow-hidden rounded-2xl border">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Carlos Doce — Founder, Twelve Creative"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="bg-muted absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="bg-primary/15 flex h-24 w-24 items-center justify-center rounded-full">
                      <span className="font-heading text-primary text-4xl font-black">
                        CD
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs tracking-widest uppercase">
                      Photo coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="border-primary space-y-4 border-l-2 pl-6">
              <p className="text-foreground/80 text-base leading-[170%] font-medium sm:text-lg">
                Carlos built Twelve Creative from the belief that most
                businesses don't have a creative problem — they have a strategy
                problem disguised as one. He combines the analytical rigor of
                growth systems with the visual instincts of a creative director.
              </p>
              <p className="text-muted-foreground text-base leading-[170%]">
                Every project at Twelve Creative reflects his core conviction:
                that positioning, creative, and execution must exist in the same
                room — not across three different agencies.
              </p>
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative hidden w-full max-w-sm shrink-0 lg:block lg:w-96">
            <div className="border-border bg-card relative aspect-3/4 w-full overflow-hidden rounded-2xl border">
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
                <div className="bg-muted absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="bg-primary/15 flex h-24 w-24 items-center justify-center rounded-full">
                    <span className="font-heading text-primary text-4xl font-black">
                      CD
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs tracking-widest uppercase">
                    Photo coming soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
