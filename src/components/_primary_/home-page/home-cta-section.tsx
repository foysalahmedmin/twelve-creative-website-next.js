import { BrandTexture } from "@/components/common/brand";
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
      className={cn(
        "bg-background w-full py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          {/* ── Contained CTA card ── */}
          <div className="bg-brand-artefact relative overflow-hidden rounded-3xl px-8 py-16 sm:px-12 sm:py-20 lg:rounded-[2rem] lg:px-20 lg:py-24">
            {/* Texture overlay */}
            <BrandTexture opacity={30} />

            {/* Decorative glow orbs */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-2xl"
            />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <span className="inline-flex rounded-full border border-[#eaeae4]/30 bg-[#eaeae4]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#eaeae4]/90 backdrop-blur-sm">
                {data.eyebrow}
              </span>

              {/* Title */}
              <h2 className="font-heading mt-6 text-3xl font-black leading-[1.05] tracking-tight text-[#eaeae4] sm:text-4xl lg:text-[3.25rem]">
                {data.title}
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#eaeae4]/70 sm:text-lg">
                {data.description}
              </p>

              {/* Divider line */}
              <div className="mx-auto mt-8 h-px w-24 bg-[#eaeae4]/20" />

              {/* Actions */}
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button asChild variant="secondary" size="xl">
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
                  className="border-[#eaeae4]/30 bg-[#eaeae4]/10 text-[#eaeae4] backdrop-blur-sm hover:bg-[#eaeae4]/20 hover:text-[#eaeae4]"
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
