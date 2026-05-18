import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { PageHeader } from "@/components/sections/page-header-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SERVICES_DATA } from "@/data/services.data";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What We Build | Twelve Creative",
  description:
    "Positioning, creative production, websites, ads, CRM, and automation — built together as a system, not as separate activities.",
};

export default function WhatWeBuildPage() {
  return (
    <main className="bg-background min-h-screen">
      {/* 1. Page Header with premium gradient & optional video */}
      <PageHeader
        label="What We Build"
        title="We build the systems that capture demand & move businesses forward."
        description="Positioning, cinematic creative, websites, CRM, and automations — all built as a single unified engine to turn attention into revenue."
        breadcrumb={[{ label: "What We Build", active: true }]}
        videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      />

      {/* 2. Interactive Alternating Showcase of Services */}
      <div className="container space-y-24 py-12 sm:space-y-32 md:py-16 lg:space-y-40">
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <section key={service.id} id={service.id} className="scroll-mt-24">
              <ScrollReveal animation="fade-in-up" durationMs={800}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-12 lg:flex-row lg:gap-16",
                    isEven ? "" : "lg:flex-row-reverse",
                  )}
                >
                  {/* Content Column */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                      <span className="bg-primary/10 text-primary border-primary/20 inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
                        Service {index + 1}
                      </span>
                      <h2 className="font-heading text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground text-base leading-relaxed font-medium sm:text-lg">
                        {service.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3">
                      <h4 className="text-foreground text-sm font-bold tracking-wider uppercase">
                        What is included
                      </h4>
                      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        {service.highlights.map((item) => (
                          <li
                            key={item}
                            className="text-foreground/90 flex items-center gap-3 text-sm font-medium"
                          >
                            <span className="border-primary/30 text-primary flex size-5 shrink-0 items-center justify-center rounded-full border">
                              <svg
                                className="size-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Link */}
                    <div className="pt-2">
                      <Link
                        href="/contact"
                        className="text-foreground hover:text-primary group/cta inline-flex items-center gap-1.5 text-base font-semibold transition-colors"
                      >
                        Discuss {service.title}
                        <span className="font-normal transition-transform duration-200 group-hover/cta:translate-x-1">
                          &gt;
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Image Column: Styled with premium 3D layered card layout to match Industries exactly! */}
                  <div className="w-full max-w-2xl flex-1">
                    <div className="relative w-full">
                      {/* Main Premium Card holding the showcase image */}
                      <div className="border-primary/15 bg-card/90 relative z-10 overflow-hidden rounded-[32px] border p-4">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]">
                          <img
                            src={service.thumbnail_src}
                            alt={service.title}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        </div>
                      </div>

                      {/* 3D Offset layered bottom card peeking from the bottom */}
                      <div className="bg-primary/15 dark:bg-primary/25 border-primary/10 pointer-events-none absolute right-[3%] -bottom-3 left-[3%] z-0 h-12 rounded-b-[28px] border-x border-b" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          );
        })}
      </div>

      {/* 3. Reusable Process Section */}
      <ProcessSection className="border-primary/10 mt-16 border-t sm:mt-24 lg:mt-32" />

      {/* 4. Home CTA Section */}
      <HomeCtaSection className="border-primary/10 border-t" />
    </main>
  );
}
