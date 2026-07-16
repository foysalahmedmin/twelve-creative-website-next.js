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
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PROCESS_ICON_MAP: Record<TProcessIconKey, typeof Search01Icon> = {
  understand: Search01Icon,
  position: Compass01Icon,
  build: PaintBrush02Icon,
  launch: Rocket01Icon,
  install: ConnectIcon,
  improve: Refresh01Icon,
};

const EASE = [0.16, 1, 0.3, 1] as const;
const pad2 = (n: number | string) => String(n).padStart(2, "0");

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
  const reduceMotion = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);

  // Scroll progress across the steps column — drives the parallax + progress bar.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start start", "end end"],
  });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const drift = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const imgScale = reduceMotion ? 1 : zoom;
  const imgY = reduceMotion ? "0%" : drift;

  useEffect(() => {
    const handleScroll = () => {
      const isDesktop = window.innerWidth >= 1024;

      if (isDesktop && rowRef.current) {
        const rect = rowRef.current.getBoundingClientRect();
        const topOffset = window.innerHeight * 0.08; // 8vh
        const stickyHeight = window.innerHeight * 0.84; // 84vh
        const totalScrollRange = rect.height - stickyHeight;

        if (totalScrollRange > 0) {
          const scrolled = topOffset - rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalScrollRange));
          const index = Math.min(
            Math.floor(progress * process_steps.length),
            process_steps.length - 1
          );
          setActiveIndex(Math.max(0, index));
          return;
        }
      }

      // Mobile/tablet fallback: closest to viewport center
      const cards = document.querySelectorAll(".process-story-card");
      const mid = window.innerHeight / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - mid);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      setActiveIndex(closestIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [process_steps.length]);

  const scrollToStep = (index: number) => {
    const cards = document.querySelectorAll(".process-story-card");
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: "smooth", block: "center" });
      setActiveIndex(index);
    }
  };

  const activeStep = process_steps[activeIndex];
  const useStepImages = !processThumbnail && process_steps.length > 0;

  return (
    <section
      className={cn(
        "border-border/40 bg-background w-full border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <CenteredSectionHeader
          label={label || "Our Process"}
          title={title || "A clear path from understanding to execution."}
          description={
            description ||
            "A tight process. Zero confusion. Real results — built around what the business actually needs to move."
          }
        />

        <div
          ref={rowRef}
          className="mt-12 flex flex-col gap-12 lg:mt-20 lg:flex-row lg:items-start"
        >
          {/* ── Left: pinned parallax showcase (desktop only) ──
              The column itself is the sticky element (its containing block is
              the tall row), a fixed-height track that vertically centres the
              media. This keeps the image perfectly still — no drift — for the
              entire time the step cards scroll past. */}
          <div className="hidden w-full shrink-0 lg:sticky lg:top-[8vh] lg:flex lg:h-[84vh] lg:max-w-130 lg:items-center lg:self-start">
            {/* Capped media card — aspect + max-height so it never gets oversized */}
            <div className="border-border relative aspect-4/5 max-h-[72vh] w-full overflow-hidden rounded-3xl border">
              {/* Parallax image layer */}
              <motion.div
                style={{ scale: imgScale, y: imgY }}
                className="absolute inset-0"
              >
                {useStepImages ? (
                  process_steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-700 ease-in-out",
                        index === activeIndex ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))
                ) : (
                  <Image
                    src={processThumbnail || process_steps[0]?.image || ""}
                    alt="Our process"
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                    priority
                  />
                )}
              </motion.div>

              {/* Scrim for legible overlay text */}
              <div className="from-background/80 via-background/15 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent" />

              {/* Overlay: active step + progress */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <span className="font-heading text-primary text-sm font-bold tracking-[0.25em]">
                      STEP {pad2(activeStep?.index ?? activeIndex + 1)} /{" "}
                      {pad2(process_steps.length)}
                    </span>
                    <h3 className="font-heading text-foreground mt-1.5 text-2xl font-black tracking-tight lg:text-3xl">
                      {activeStep?.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <div className="bg-foreground/15 mt-6 h-1 w-full overflow-hidden rounded-full">
                  <motion.div
                    style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
                    className="bg-primary h-full w-full origin-left rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: step cards ──
              The vertical runway (desktop only) gives the sticky media a large
              enough pinned window that every card reaches centre while the
              image is already fixed — so the image never drifts up or down. */}
          <div
            className="flex-1 space-y-6 lg:py-[var(--steps-padding)]"
            style={
              {
                "--steps-padding": "calc((84vh - min(650px, 72vh)) / 2)",
              } as React.CSSProperties
            }
          >
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
                      "cursor-pointer rounded-2xl border p-6 sm:p-8",
                      isActive
                        ? "border-primary bg-card scale-[102%] shadow-sm"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className={cn(
                          "hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 lg:flex",
                          isActive
                            ? "bg-primary text-primary-foreground scale-110 shadow-sm"
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
                          <h3 className="font-heading text-foreground text-lg font-black tracking-tight sm:text-xl">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                          {step.description}
                        </p>

                        {/* Collapsible image — mobile only */}
                        <div
                          className={cn(
                            "mt-4 overflow-hidden rounded-2xl transition-all duration-500 ease-in-out lg:hidden",
                            isActive
                              ? "max-h-85 scale-100 opacity-100"
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
