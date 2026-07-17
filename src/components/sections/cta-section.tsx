"use client";

import { BrandFrame } from "@/components/common/brand";
import { Button } from "@/components/ui/button";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TCTAData {
  title: string;
  description: string;
  image: string;
  href: string;
  buttonText: string;
}

interface CTASectionProps {
  data: TCTAData;
  className?: string;
}

export const CTASection = ({ data, className = "" }: CTASectionProps) => {
  return (
    <section className={cn("bg-background w-full py-16 lg:py-24", className)}>
      <div className="container">
        {/* ── Contained CTA card ── */}
        <div className="bg-brand-artefact relative overflow-hidden rounded-3xl px-8 py-14 sm:px-12 lg:rounded-[2rem] lg:px-16 lg:py-20">
          {/* Dark-mode decorative glow */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 hidden h-[28rem] w-[28rem] rounded-full bg-white/[0.06] blur-3xl dark:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-32 hidden h-80 w-80 rounded-full bg-white/[0.04] blur-3xl dark:block"
          />

          <div className="relative z-10 flex flex-col items-center gap-10 lg:flex-row lg:items-stretch lg:gap-14">
            {/* Image — framed with the brand "box" device */}
            <BrandFrame
              inset
              tone="primary-foreground"
              className="w-full shrink-0 sm:max-w-sm lg:max-w-[40%]"
            >
              {/* Mobile: fixed aspect ratio. Desktop: stretches to match content height */}
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl lg:aspect-auto lg:h-full lg:min-h-[260px]">
                <Link href={data.href} className="block h-full w-full">
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
              </div>
            </BrandFrame>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center gap-5 text-center lg:text-left">
              <h2 className="font-heading text-primary-foreground text-2xl leading-[1.1] font-black tracking-tight sm:text-3xl lg:text-4xl dark:text-[#eaeae4]">
                {data.title}
              </h2>
              <p className="text-primary-foreground/80 mx-auto max-w-xl text-sm leading-relaxed font-medium sm:text-base lg:mx-0 dark:text-[#eaeae4]/70">
                {data.description}
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  size="default"
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary"
                >
                  <Link href={data.href}>
                    {data.buttonText}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
