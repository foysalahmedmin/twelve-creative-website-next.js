"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface SaasInsightProps {
  data?: {
    image: string;
    tag: string;
    heading: string;
    description: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  className?: string;
}

const DEFAULT_SAAS_DATA = {
  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=768&h=552&fit=crop&auto=format",
  tag: "Insight Blueprint",
  heading: "SaaS Explainer Videos Engineered to Convert Visitors into Customers",
  description: "Features mean absolutely nothing if prospects don't understand them in the first 60 seconds. Tight custom editing removes cognitive load, highlights business benefits over dry technical specs, and guides prospects to exact problem solutions without wasting their time.",
  primaryCtaText: "Get an Estimate",
  primaryCtaLink: "/contact",
  secondaryCtaText: "Our Works",
  secondaryCtaLink: "/works",
};

export const SaasInsight = ({ data = DEFAULT_SAAS_DATA, className }: SaasInsightProps) => {
  const { image, tag, heading, description, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink } = data;

  return (
    <section className={cn("w-full bg-background border-t border-border/40 py-16 sm:py-20 lg:py-24", className)}>
      <div className="container">
        {/* 3D layered offset card wrapper for the main box block */}
        <div className="relative w-full">
          {/* Peeking bottom layered element */}
          <div className="absolute -bottom-3 left-[3%] right-[3%] h-12 bg-muted rounded-b-3xl z-0 border-x border-b border-border pointer-events-none" />

          {/* Main box holding card content */}
          <div className="relative rounded-3xl border border-border bg-card p-8 sm:p-10 lg:p-12 z-10 shadow-sm">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

              {/* Left Image Showcase Panel */}
              <ScrollReveal animation="fade-in-left" durationMs={800} className="flex-1 w-full relative aspect-[4/3] rounded-2xl overflow-hidden border border-border">
                <Image
                  src={image}
                  alt="SaaS Insights Overview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </ScrollReveal>

              {/* Right Information Details Column */}
              <ScrollReveal animation="fade-in-right" delayMs={150} durationMs={800} className="flex-1 w-full space-y-6">
                <div className="space-y-6">
                  <span className="inline-flex items-center rounded-md border border-foreground/25 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground">
                    {tag}
                  </span>

                  <h2 className="font-heading text-foreground text-[40px] md:text-[56px] font-black leading-[1.05] tracking-tight mt-6">
                    {heading}
                  </h2>

                  <p className="text-muted-foreground text-[14px] md:text-[16px] leading-[150%] font-normal mt-6">
                    {description}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col md:flex-row gap-3 mt-10">
                  <Link
                    href={primaryCtaLink}
                    className="md:w-[205px] w-full h-12 rounded-lg bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-[0.05em] text-center flex items-center justify-center px-6 hover:opacity-90 active:scale-95 duration-200 transition-all select-none"
                  >
                    {primaryCtaText}
                  </Link>

                  <Link
                    href={secondaryCtaLink}
                    className="md:w-[155px] w-full h-12 rounded-lg border border-border text-foreground text-sm font-semibold uppercase tracking-[0.05em] text-center flex items-center justify-center px-6 hover:bg-muted active:scale-95 duration-200 transition-all"
                  >
                    {secondaryCtaText}
                  </Link>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaasInsight;
