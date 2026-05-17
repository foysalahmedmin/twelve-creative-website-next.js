"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { Card } from "@/components/ui/card";
import { PROCESS_DATA, type TProcessIconKey } from "@/data/process.data";
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
import { useState } from "react";

const PROCESS_ICON_MAP: Record<TProcessIconKey, typeof Search01Icon> = {
  understand: Search01Icon,
  position: Compass01Icon,
  build: PaintBrush02Icon,
  launch: Rocket01Icon,
  install: ConnectIcon,
  improve: Refresh01Icon,
};

export const ProcessSection = ({ className }: { className?: string }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeStep = PROCESS_DATA[activeIndex];
  const ActiveIcon = PROCESS_ICON_MAP[activeStep.icon];

  return (
    <section
      className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}
    >
      <div className="container">
        <CenteredSectionHeader
          label="Our Process"
          title="A clear path from understanding to execution."
          description="A tight process. Zero confusion. Real results — built around what the business actually needs to move."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Active step visual */}
          <div className="order-2 lg:order-1 lg:sticky lg:top-28 lg:self-start">
            <Card className="from-primary/12 to-primary/3 ring-primary/20 relative aspect-square overflow-hidden bg-linear-to-br p-0 ring-1">
              <div
                aria-hidden
                className="bg-primary/15 absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl"
              />
              <div
                aria-hidden
                className="bg-primary/10 absolute -right-20 -bottom-20 h-64 w-64 rounded-full blur-3xl"
              />

              <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">
                {/* Top: step badge */}
                <div className="flex items-center justify-between">
                  <span className="bg-card text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-widest">
                    STEP {activeStep.index}
                  </span>
                  <span className="text-primary/40 font-heading text-7xl font-bold leading-none tracking-tight sm:text-8xl">
                    {activeStep.index}
                  </span>
                </div>

                {/* Center: Big icon */}
                <div className="flex justify-center">
                  <div className="bg-card text-primary ring-primary/20 flex h-32 w-32 items-center justify-center rounded-3xl ring-8 shadow-xl backdrop-blur-sm sm:h-40 sm:w-40">
                    <HugeiconsIcon icon={ActiveIcon} className="h-16 w-16 sm:h-20 sm:w-20" />
                  </div>
                </div>

                {/* Bottom: title + label */}
                <div className="space-y-2 text-center">
                  <p className="text-primary text-xs font-bold tracking-widest uppercase">
                    Current Phase
                  </p>
                  <h3 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {activeStep.title}
                  </h3>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Step list */}
          <div className="order-1 space-y-3 lg:order-2">
            {PROCESS_DATA.map((step, index) => {
              const Icon = PROCESS_ICON_MAP[step.icon];
              const isActive = index === activeIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "group/step w-full text-left transition-all duration-300",
                    "rounded-3xl border p-5 sm:p-6",
                    isActive
                      ? "from-primary/8 to-card border-primary/30 bg-linear-to-br shadow-md"
                      : "border-border/60 bg-card hover:border-primary/20 hover:bg-primary/2",
                  )}
                  aria-pressed={isActive}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <HugeiconsIcon icon={Icon} className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs font-bold tracking-widest",
                            isActive ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {step.index}
                        </span>
                        <h3 className="font-heading text-foreground text-base font-semibold tracking-tight sm:text-lg">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
