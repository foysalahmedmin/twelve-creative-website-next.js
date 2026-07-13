import { Button } from "@/components/ui/button";
import { BrandTexture } from "@/components/common/brand";
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
        "bg-brand-artefact relative w-full overflow-hidden py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      <BrandTexture opacity={35} />

      <div className="relative z-10 container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <div className="relative mx-auto max-w-3xl text-center">
              {/* Eyebrow Label */}
              <span className="inline-flex rounded-md border border-[#eaeae4]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#eaeae4]">
                {data.eyebrow}
              </span>

              {/* Title */}
              <h2 className="font-heading mt-5 text-3xl font-black tracking-tight leading-[1.05] text-[#eaeae4] sm:text-4xl lg:text-5xl">
                {data.title}
              </h2>

              {/* Description */}
              <p className="mt-5 text-base leading-relaxed text-[#eaeae4]/75 sm:text-lg">
                {data.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button asChild variant="secondary" size="xl">
                  <Link href={data.primary_cta.href} className="inline-flex items-center gap-2">
                    {data.primary_cta.label}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-[#eaeae4]/40 bg-transparent text-[#eaeae4] hover:bg-[#eaeae4]/10 hover:text-[#eaeae4]"
                >
                  <Link href={data.secondary_cta.href}>
                    {data.secondary_cta.label}
                  </Link>
                </Button>
              </div>
            </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
