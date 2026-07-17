import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Button } from "@/components/ui/button";
import { HOME_CTA_DATA } from "@/data/home-cta.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const HomeCtaSection = ({ className }: { className?: string }) => {
  const data = HOME_CTA_DATA;

  return (
    <section
      className={cn("bg-background w-full py-16 sm:py-20 lg:py-24", className)}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          {/* ── Contained CTA card ── */}
          <div className="bg-brand-artefact relative overflow-hidden rounded-3xl px-8 py-16 sm:px-12 sm:py-20 lg:rounded-[2rem] lg:px-20 lg:py-24">
            {/* Dark-mode decorative glow orbs */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 hidden h-96 w-96 rounded-full bg-white/5 blur-3xl dark:block"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-32 -bottom-32 hidden h-96 w-96 rounded-full bg-white/5 blur-3xl dark:block"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-2xl dark:block"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <span className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground inline-flex rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase backdrop-blur-sm dark:border-[#eaeae4]/30 dark:bg-[#eaeae4]/10 dark:text-[#eaeae4]/90">
                {data.eyebrow}
              </span>

              {/* Title */}
              <h2 className="font-heading text-primary-foreground mt-6 text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl lg:text-[3.25rem] dark:text-[#eaeae4]">
                {data.title}
              </h2>

              {/* Description */}
              <p className="text-primary-foreground/80 mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg dark:text-[#eaeae4]/70">
                {data.description}
              </p>

              {/* Divider line */}
              <div className="bg-primary-foreground/20 mx-auto mt-8 h-px w-24 dark:bg-[#eaeae4]/20" />

              {/* Actions */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button
                  asChild
                  variant="secondary"
                  size="xl"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary"
                >
                  <Link
                    href={data.primary_cta.href}
                    className="inline-flex items-center gap-2"
                  >
                    {data.primary_cta.label}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-primary dark:border-[#eaeae4]/30 dark:bg-[#eaeae4]/10 dark:text-[#eaeae4] dark:backdrop-blur-sm dark:hover:bg-[#eaeae4]/20 dark:hover:text-[#eaeae4]"
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
