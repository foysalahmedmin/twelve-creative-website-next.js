"use client";

import { isStartConversationCta } from "@/components/common/booking-modal";
import { BrandFrame } from "@/components/common/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";
import { openBookingModal } from "@/redux/slices/booking-modal-slice";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export interface TCTAV1Data {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  href: string;
  buttonText: string;
  secondaryCta?: {
    label: string;
    href: string;
  } | null;
}

interface CTAV1SectionProps {
  data: TCTAV1Data;
  className?: string;
}

export const CTAV1Section = ({ data, className = "" }: CTAV1SectionProps) => {
  const dispatch = useAppDispatch();

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
              {data.eyebrow && (
                <span className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground mx-auto inline-flex w-fit rounded-full border px-4 py-1.5 text-[11px] font-bold tracking-[0.14em] uppercase backdrop-blur-sm lg:mx-0 dark:border-[#eaeae4]/30 dark:bg-[#eaeae4]/10 dark:text-[#eaeae4]/90">
                  {data.eyebrow}
                </span>
              )}
              <h2 className="font-heading text-primary-foreground text-2xl leading-[1.1] font-black tracking-tight sm:text-3xl lg:text-4xl dark:text-[#eaeae4]">
                {data.title}
              </h2>
              <p className="text-primary-foreground/80 mx-auto max-w-xl text-sm leading-relaxed font-medium sm:text-base lg:mx-0 dark:text-[#eaeae4]/70">
                {data.description}
              </p>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="default"
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary"
                >
                  {isStartConversationCta(data.buttonText) ? (
                    <button
                      type="button"
                      onClick={() => dispatch(openBookingModal())}
                    >
                      {data.buttonText}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-4"
                      />
                    </button>
                  ) : (
                    <Link href={data.href}>
                      {data.buttonText}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-4"
                      />
                    </Link>
                  )}
                </Button>
                {data.secondaryCta && (
                  <Button
                    asChild
                    size="default"
                    variant="outline"
                    className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent dark:border-[#eaeae4]/30 dark:text-[#eaeae4] dark:hover:bg-[#eaeae4]/10 dark:hover:text-[#eaeae4]"
                  >
                    {isStartConversationCta(data.secondaryCta.label) ? (
                      <button
                        type="button"
                        onClick={() => dispatch(openBookingModal())}
                      >
                        {data.secondaryCta.label}
                      </button>
                    ) : (
                      <Link href={data.secondaryCta.href}>
                        {data.secondaryCta.label}
                      </Link>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
