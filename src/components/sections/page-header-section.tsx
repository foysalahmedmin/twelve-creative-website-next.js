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
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import { ScrollReveal } from "../common/scroll-reveal";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

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
    <section
      className={cn(
        "bg-brand-hero relative w-full overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-28",
        className,
      )}
    >
      <div className="relative z-10 container mx-auto flex max-w-4xl flex-col items-center justify-center text-center">
        {/* Eyebrow Label Capsule */}
        {label && (
          <>
            <ScrollReveal animation="fade-in-down" durationMs={700}>
              <span className="border-foreground/40 text-foreground mb-6 hidden rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                {label}
              </span>
            </ScrollReveal>
          </>
        )}

        {/* Breadcrumbs */}
        {breadcrumb && breadcrumb.length > 0 && (
          <>
            <ScrollReveal
              animation="fade-in-up"
              delayMs={100}
              durationMs={700}
              className="text-foreground/70 [&_a]:text-foreground/60 [&_a:hover]:text-foreground mb-6"
            >
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
          <ScrollReveal
            animation="fade-in-up"
            durationMs={700}
            delayMs={120}
            className="max-w-3xl space-y-4"
          >
            <h1 className="font-heading text-foreground text-3xl leading-[1.05] font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </ScrollReveal>
          {description && (
            <ScrollReveal
              animation="fade-in-up"
              durationMs={700}
              delayMs={250}
              className="max-w-3xl space-y-4"
            >
              <p className="text-foreground/80 mx-auto text-base leading-relaxed font-medium sm:text-lg">
                {description}
              </p>
            </ScrollReveal>
          )}
        </>

        {/* Video or thumbnail preview */}
        {(videoSrc || thumbnailSrc) && (
          <ScrollReveal
            animation="zoom-in"
            delayMs={400}
            durationMs={900}
            className="w-full px-4 lg:px-12"
          >
            <div className="ring-foreground/15 relative mx-auto mt-12 aspect-video w-full max-w-5xl overflow-hidden rounded-2xl ring-1 lg:mt-16">
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
    </section>
  );
};
