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
      className={cn(
        "bg-background relative overflow-hidden py-16 sm:py-20 lg:py-28",
        className,
      )}
    >
      <div className="container relative">
        <div className="from-primary-from to-primary-to ring-primary/20 relative overflow-hidden rounded-4xl bg-linear-to-br p-8 ring-1 sm:p-12 lg:p-16">
          {/* Decorative orbs */}
          <div
            aria-hidden
            className="bg-primary-foreground/15 absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl"
          />
          <div
            aria-hidden
            className="bg-primary-foreground/10 absolute -bottom-32 -left-20 h-80 w-80 rounded-full blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="bg-primary-foreground/20 text-primary-foreground inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
              {data.eyebrow}
            </span>

            <h2 className="font-heading text-primary-foreground mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {data.title}
            </h2>

            <p className="text-primary-foreground/85 mt-5 text-base leading-relaxed sm:text-lg">
              {data.description}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 bg-background text-foreground hover:bg-background/90 px-6 text-sm font-semibold"
              >
                <Link href={data.primary_cta.href}>
                  {data.primary_cta.label}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground h-12 px-6 text-sm font-semibold"
              >
                <Link href={data.secondary_cta.href}>
                  {data.secondary_cta.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
