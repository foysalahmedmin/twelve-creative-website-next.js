"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
import { ScrollReveal } from "../common/scroll-reveal";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface BreadcrumbItemType {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItemType[];
  videoSrc?: string;
  thumbnailSrc?: string;
  className?: string;
}

export const PageHeader = ({
  label,
  title,
  description,
  breadcrumb,
  videoSrc,
  thumbnailSrc,
  className,
}: PageHeaderProps) => {
  return (
    <section className={cn("relative container mt-6 mb-10", className)}>
      {/* Outer rounded card with background gradient inspired by Home Hero */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl lg:rounded-[40px] py-16 sm:py-20 lg:py-28 px-4 sm:px-8",
          "from-primary/3 via-primary/8 to-primary/20 bg-linear-to-b",
        )}
      >
        {/* Soft modern ambient orbs */}
        <div
          aria-hidden
          className="bg-primary/10 pointer-events-none absolute top-1/4 -right-32 h-80 w-80 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="bg-primary/10 pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full blur-3xl"
        />

        <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center justify-center text-center">
          {/* Eyebrow Label Capsule */}
          {label && (
            <>
              <ScrollReveal animation="fade-in-down" durationMs={700}>
                <span className="inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                  {label}
                </span>
              </ScrollReveal>

            </>
          )}

          {/* Breadcrumbs */}
          {breadcrumb && breadcrumb.length > 0 && (
            <>
              <ScrollReveal animation="fade-in-up" delayMs={100} durationMs={700} className="mb-6">
                <Breadcrumb>
                  <BreadcrumbList className="justify-center">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    {breadcrumb.map((item, index) => (
                      <React.Fragment key={index}>
                        <BreadcrumbItem>
                          {item.active || !item.href ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </ScrollReveal>
            </>
          )}

          {/* Title & Description */}
          <>
            <ScrollReveal animation="fade-in-up" durationMs={700} delayMs={120} className="max-w-3xl space-y-4">
              <h1 className="text-foreground font-heading text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[115%]">
                {title}
              </h1>

            </ScrollReveal>
            {description && (
              <ScrollReveal animation="fade-in-up" durationMs={700} delayMs={250} className="max-w-3xl space-y-4">
                <p className="text-muted-foreground mx-auto text-base sm:text-lg leading-relaxed font-medium">
                  {description}
                </p>
              </ScrollReveal>
            )}
          </>

          {/* Video or thumbnail preview */}
          {(videoSrc || thumbnailSrc) && (
            <ScrollReveal animation="zoom-in" delayMs={400} durationMs={900} className="w-full px-4 lg:px-12">
              <div className="ring-foreground/10 relative mx-auto mt-12 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl ring-1 lg:mt-16 lg:rounded-[32px]">
                {videoSrc ? (
                  <ReactPlayer
                    src={videoSrc}
                    controls
                    width="100%"
                    height="100%"
                    playsInline
                    light={thumbnailSrc || false}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailSrc}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
};
