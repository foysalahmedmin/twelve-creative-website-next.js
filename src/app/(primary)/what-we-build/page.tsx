import { PageHeader } from "@/components/sections/page-header-section";
import { SERVICES_DATA } from "@/data/services.data";
import { ProcessSection } from "@/components/_primary_/home-page/process-section";
import { HomeCtaSection } from "@/components/_primary_/home-page/home-cta-section";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

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
      <div className="container py-12 md:py-16 space-y-24 sm:space-y-32 lg:space-y-40">
        {SERVICES_DATA.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-24"
            >
              <ScrollReveal animation="fade-in-up" durationMs={800}>
                <div
                  className={cn(
                    "flex flex-col lg:flex-row items-center gap-12 lg:gap-16",
                    isEven ? "" : "lg:flex-row-reverse"
                  )}
                >
                  {/* Content Column */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-3">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                        Service {index + 1}
                      </span>
                      <h2 className="font-heading text-foreground text-3xl sm:text-4xl font-medium tracking-tight">
                        {service.title}
                      </h2>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">
                        {service.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold tracking-wider text-foreground uppercase">
                        What is included
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {service.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 text-sm text-foreground/90 font-medium"
                          >
                            <span className="flex items-center justify-center size-5 rounded-full border border-primary/30 text-primary shrink-0">
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
                        className="inline-flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-primary transition-colors group/cta"
                      >
                        Discuss {service.title}
                        <span className="transition-transform duration-200 group-hover/cta:translate-x-1 font-normal">
                          &gt;
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Image Column: Styled with premium 3D layered card layout to match Industries exactly! */}
                  <div className="flex-1 w-full max-w-2xl">
                    <div className="relative w-full">
                      {/* Main Premium Card holding the showcase image */}
                      <div className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-card/90 p-4 z-10">
                        <div className="relative overflow-hidden rounded-[24px] aspect-[4/3] w-full">
                          <img
                            src={service.thumbnail_src}
                            alt={service.title}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>

                      {/* 3D Offset layered bottom card peeking from the bottom */}
                      <div className="absolute -bottom-3 left-[3%] right-[3%] h-12 bg-primary/15 dark:bg-primary/25 rounded-b-[28px] z-0 border-x border-b border-primary/10 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>
          );
        })}
      </div>

      {/* 3. Reusable Process Section */}
      <ProcessSection className="border-t border-primary/10 mt-16 sm:mt-24 lg:mt-32" />

      {/* 4. Home CTA Section */}
      <HomeCtaSection className="border-t border-primary/10" />
    </main>
  );
}
