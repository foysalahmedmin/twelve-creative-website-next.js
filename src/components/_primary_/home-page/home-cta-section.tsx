import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { HOME_CTA_DATA } from "@/data/home-cta.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const HomeCtaSection = ({ className }: { className?: string }) => {
  const data = HOME_CTA_DATA;

  return (
    <section
      className={cn(
        "bg-background relative overflow-hidden py-16 sm:py-20 lg:py-28",
        className,
      )}
    >
      <div className="container relative">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          {/* Card container using primary opacity and premium gradients exactly as requested */}
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-primary/12 via-primary/5 to-primary/8 border border-primary/20 p-8 sm:p-12 lg:p-16 backdrop-blur-sm">
            {/* Soft, modern ambient glow orbs inside the card */}
            <div
              aria-hidden
              className="bg-primary/25 absolute -top-24 -right-24 h-96 w-96 rounded-full blur-[100px]"
            />
            <div
              aria-hidden
              className="bg-primary/15 absolute -bottom-36 -left-24 h-96 w-96 rounded-full blur-[100px]"
            />

            <div className="relative mx-auto max-w-3xl text-center z-10">
              {/* Eyebrow Label */}
              <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                {data.eyebrow}
              </span>

              {/* Title */}
              <h2 className="font-heading text-foreground mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {data.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg font-medium">
                {data.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href={data.primary_cta.href} className="inline-flex items-center gap-2">
                    {data.primary_cta.label}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </Button>
                
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-foreground text-foreground h-12 px-6 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link href={data.secondary_cta.href}>
                    {data.secondary_cta.label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
