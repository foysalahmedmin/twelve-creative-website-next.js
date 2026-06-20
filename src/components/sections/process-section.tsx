"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { TProcessData, type TProcessIconKey } from "@/data/process.data";
import { cn } from "@/lib/utils";
import {
  Compass01Icon,
  ConnectIcon,
  PaintBrush02Icon,
  Refresh01Icon,
  Rocket01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const PROCESS_ICON_MAP: Record<TProcessIconKey, typeof Search01Icon> = {
  understand: Search01Icon,
  position: Compass01Icon,
  build: PaintBrush02Icon,
  launch: Rocket01Icon,
  install: ConnectIcon,
  improve: Refresh01Icon,
};

export interface PageProcessSectionProps {
  data: TProcessData;
  className?: string;
  processThumbnail?: string;
}

export const ProcessSection = ({
  data,
  className,
  processThumbnail,
}: Partial<PageProcessSectionProps>) => {
  const { label, title, description, process_steps = [] } = data || {};
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll(".process-story-card");
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (
          rect.top < window.innerHeight / 2 &&
          rect.bottom > window.innerHeight / 2
        ) {
          setActiveIndex(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStep = (index: number) => {
    const cards = document.querySelectorAll(".process-story-card");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}>
      <div className="container">
        <CenteredSectionHeader
          label={label || "Our Process"}
          title={title || "A clear path from understanding to execution."}
          description={
            description ||
            "A tight process. Zero confusion. Real results — built around what the business actually needs to move."
          }
        />

        <div className="mt-12 flex flex-col gap-12 lg:mt-20 lg:flex-row">
          {/* Left: Sticky Image Showcase (hidden on small/medium screens, sticky on desktop) */}
          <div className="hidden h-[620px] w-full max-w-[580px] overflow-hidden rounded-3xl shadow-2xl lg:sticky lg:top-36 lg:block lg:self-start">
            <div className="from-primary/10 to-primary/5 ring-primary/15 relative h-full w-full overflow-hidden rounded-3xl bg-linear-to-br ring-1">
              {processThumbnail ? (
                <div className="absolute inset-0">
                  <Image
                    src={processThumbnail}
                    alt="Our process"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="scale-100 rounded-3xl object-cover transition-transform duration-700 ease-out hover:scale-105"
                    priority
                  />
                  <div className="from-background/40 pointer-events-none absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
                </div>
              ) : (
                process_steps?.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      index === activeIndex
                        ? "z-10 opacity-100"
                        : "z-0 opacity-0",
                    )}
                  >
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="scale-100 rounded-3xl object-cover transition-transform duration-700 ease-out hover:scale-105"
                      priority={index === 0}
                    />
                    <div className="from-background/40 pointer-events-none absolute inset-0 bg-linear-to-t via-transparent to-transparent" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Step cards list */}
          <div className="flex-1 space-y-6">
            {process_steps?.map((step, index) => {
              const Icon = PROCESS_ICON_MAP[step.icon];
              const isActive = index === activeIndex;

              return (
                <div
                  key={step.id}
                  className="process-story-card transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => scrollToStep(index)}
                    className={cn(
                      "group/step w-full text-left transition-all duration-300",
                      "cursor-pointer rounded-3xl border p-6 sm:p-8",
                      isActive
                        ? "from-primary/10 to-card border-primary/30 ring-primary/10 scale-[102%] bg-linear-to-br shadow-xl ring-1"
                        : "border-border/60 bg-card hover:border-primary/20 hover:bg-primary/2",
                    )}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-primary/20 scale-110 shadow-lg"
                            : "bg-primary/10 text-primary group-hover/step:scale-105",
                        )}
                      >
                        <HugeiconsIcon icon={Icon} className="h-6 w-6" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={cn(
                              "text-xs font-bold tracking-widest uppercase transition-colors duration-300",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          >
                            STEP {step.index}
                          </span>
                          <h3 className="font-heading text-foreground text-lg font-bold tracking-tight sm:text-xl">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                          {step.description}
                        </p>

                        {/* Collapsible Image for mobile view only */}
                        <div
                          className={cn(
                            "mt-4 overflow-hidden rounded-2xl transition-all duration-500 ease-in-out lg:hidden",
                            isActive
                              ? "max-h-[350px] scale-100 opacity-100"
                              : "max-h-0 scale-95 opacity-0",
                          )}
                        >
                          <div className="border-border/40 relative aspect-16/10 w-full overflow-hidden rounded-2xl border">
                            <Image
                              src={step.image}
                              alt={step.title}
                              fill
                              sizes="100vw"
                              className="rounded-2xl object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
