import { Button } from "@/components/ui/button";
import { HOME_HERO_DATA } from "@/data/home-hero.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon, PlayCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const HeroSection = ({ className }: { className?: string }) => {
  const data = HOME_HERO_DATA;

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        "bg-background pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32",
        className,
      )}
    >
      {/* Decorative background — soft primary radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="bg-primary/15 absolute top-1/2 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl" />
        <div className="bg-primary/8 absolute bottom-0 left-1/4 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="container relative flex flex-col items-center text-center">
        {/* Eyebrow */}
        <span className="border-primary/30 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
          <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
          {data.eyebrow}
        </span>

        {/* Headline */}
        <h1 className="font-heading text-foreground max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {data.title}{" "}
          <span className="from-primary-from to-primary-to bg-linear-to-tr bg-clip-text text-transparent">
            {data.highlight}
          </span>
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed font-medium sm:text-lg lg:text-xl">
          {data.description}
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="h-12 px-6 text-sm font-semibold">
            <Link href={data.primary_cta.href}>
              {data.primary_cta.label}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-6 text-sm font-semibold"
          >
            <Link href={data.secondary_cta.href}>
              <HugeiconsIcon icon={PlayCircleIcon} className="size-4" />
              {data.secondary_cta.label}
            </Link>
          </Button>
        </div>

        {/* Trust strip */}
        <div className="border-border/60 mt-14 flex w-full max-w-3xl flex-col items-center gap-4 border-t pt-8 sm:flex-row sm:justify-center sm:gap-6">
          <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {data.trust_label}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {data.trust_industries.map((industry, index) => (
              <div key={industry.id} className="flex items-center gap-5">
                <span className="text-foreground/70 text-sm font-semibold">
                  {industry.name}
                </span>
                {index < data.trust_industries.length - 1 && (
                  <span className="bg-border h-1 w-1 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
