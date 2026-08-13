"use client";

import { InlineVideoPlayer } from "@/components/common/inline-video-player";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import type { TIndustry } from "@/data/industries.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const pad = (n: number) => String(n).padStart(2, "0");

const detailHref = (industry: TIndustry) => `/industries/${industry.id}`;

// ── Media panel — plays the industry film, or shows the still ─────────────
function IndustryMedia({ industry }: { industry: TIndustry }) {
  const poster = industry.thumbnailSrc || industry.image;

  return (
    <div
      className={cn(
        "border-border relative w-full overflow-hidden rounded-2xl border shadow-sm",
        // Nothing in this row is aligned against the media's height — the grid
        // centres the two columns against each other — so the film is free to
        // set its own shape and never needs letterboxing. The still is not:
        // it is object-cover, so it keeps the editorial crop it was designed
        // with.
        !industry.videoSrc && "aspect-4/3 lg:aspect-16/11",
      )}
    >
      {industry.videoSrc ? (
        <InlineVideoPlayer
          src={industry.videoSrc}
          title={`${industry.name} film`}
          thumbnailSrc={poster}
          adaptiveFrame
        />
      ) : (
        <Link href={detailHref(industry)} className="group block h-full w-full">
          <Image
            src={industry.image}
            alt={industry.name}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="from-background/30 absolute inset-0 bg-linear-to-t to-transparent" />
        </Link>
      )}
    </div>
  );
}

// ── One full-width industry section ───────────────────────────────────────
function IndustryRow({
  industry,
  index,
}: {
  industry: TIndustry;
  index: number;
}) {
  const mediaRight = index % 2 === 1;
  const href = detailHref(industry);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14 xl:gap-20">
      {/* Media */}
      <ScrollReveal
        animation={mediaRight ? "fade-in-right" : "fade-in-left"}
        durationMs={800}
        className={cn(mediaRight ? "lg:order-2" : "lg:order-1")}
      >
        <IndustryMedia industry={industry} />
      </ScrollReveal>

      {/* Content */}
      <ScrollReveal
        animation={mediaRight ? "fade-in-left" : "fade-in-right"}
        durationMs={800}
        delayMs={120}
        className={cn(
          "flex flex-col items-start gap-5",
          mediaRight ? "lg:order-1" : "lg:order-2",
        )}
      >
        <div className="flex items-center gap-4">
          <span className="font-heading text-primary/25 text-4xl font-black tabular-nums sm:text-5xl">
            {pad(index + 1)}
          </span>
          <span className="border-foreground/25 text-foreground rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
            {industry.name}
          </span>
        </div>

        <h2 className="font-heading text-foreground text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl lg:leading-[1.1]">
          <Link href={href} className="hover:text-primary transition-colors">
            {industry.headline}
          </Link>
        </h2>

        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed md:text-base">
          {industry.description}
        </p>

        {industry.work.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {industry.work.slice(0, 6).map((item) => (
              <li
                key={item}
                className="border-border bg-muted text-foreground/70 rounded-md border px-3 py-1 text-xs font-medium"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={href}
          className="group bg-primary text-primary-foreground focus-visible:ring-primary/50 mt-2 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold tracking-[0.05em] uppercase transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
        >
          {industry.ctaLabel ?? `Explore ${industry.name}`}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </ScrollReveal>
    </div>
  );
}

interface IndustriesDetailSectionProps {
  data: TIndustry[];
  className?: string;
}

export const IndustriesDetailSection = ({
  data,
  className,
}: IndustriesDetailSectionProps) => {
  if (!data || data.length === 0) return null;

  return (
    <section
      className={cn(
        "bg-background border-border/40 w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container flex flex-col gap-20 lg:gap-28">
        {data.map((industry, index) => (
          <section key={industry.id} id={industry.id} className="scroll-mt-24">
            <IndustryRow industry={industry} index={index} />
          </section>
        ))}
      </div>
    </section>
  );
};
