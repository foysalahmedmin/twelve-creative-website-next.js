"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

export interface IInsightStep {
  title: string;
  description: string;
  image: string;
  items: string[];
}

export interface PodcastInsightProps {
  data: {
    tag: string;
    heading_title: string;
    paragraph: string;
    steps: IInsightStep[];
  };
  className?: string;
}

// ── Custom Vertical Stepper ────────────────────────────
interface VerticalStepperProps {
  steps: { title: string }[];
  activeIndex: number;
  onStepClick: (idx: number) => void;
}

const VerticalStepper = ({ steps, activeIndex, onStepClick }: VerticalStepperProps) => {
  return (
    <div className="relative grid w-full max-w-85 grid-cols-[auto_1fr] gap-x-4 mt-6">
      {/* Background connecting vertical progress line */}
      <div
        className="pointer-events-none absolute left-[39px] top-8 h-[70%] w-2"
        style={{
          background: `linear-gradient(180deg, rgba(234, 105, 45, 0.2) 0.02%, #ea692d 21.38%, rgba(234, 105, 45, 0.2) 100%)`,
        }}
      />

      {steps.map((step, idx) => {
        const isActive = idx === activeIndex;

        return (
          <React.Fragment key={idx}>
            {/* Left Dot Panel */}
            <div
              onClick={() => onStepClick(idx)}
              className="col-start-1 row-span-1 cursor-pointer flex items-start pt-1 z-10"
            >
              {isActive ? (
                // Active custom square ring
                <div
                  className="relative p-px z-10 text-[25px] font-heading text-white flex items-center justify-center rounded-[24px] w-[86px] h-[86px]"
                  style={{
                    background: `linear-gradient(250.64deg, rgba(234, 105, 45, 0.5) 0%, rgba(234, 105, 45, 0) 50%, rgba(234, 105, 45, 0.5) 100%)`,
                  }}
                >
                  <span className="w-full h-full rounded-[23px] bg-linear-to-br from-primary-from to-primary-to text-white flex items-center justify-center font-semibold text-lg shadow-md">
                    {idx + 1}
                  </span>
                </div>
              ) : (
                // Inactive circular node with smooth hover effects
                <div className="relative w-[84px] h-[84px] z-10 flex items-center justify-center text-zinc-900 group">
                  <span className="text-xs font-semibold leading-none flex justify-center items-center h-7 w-7 rounded-full bg-white border border-primary/20 transition-all duration-200 group-hover:scale-110 group-hover:border-primary/50 group-hover:bg-primary/5 dark:bg-zinc-900 dark:text-zinc-100">
                    {idx + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Right Text Title Panel */}
            <div
              onClick={() => onStepClick(idx)}
              className="col-start-2 cursor-pointer flex items-center select-none"
            >
              <p
                className={cn(
                  "text-[17px] font-medium transition-colors duration-200",
                  isActive ? "text-foreground font-semibold" : "text-slate-500 hover:text-foreground/80"
                )}
              >
                {step.title}
              </p>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Main Section ───────────────────────────────────────
export const PodcastInsight = ({ data, className }: PodcastInsightProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const { tag, heading_title, paragraph, steps = [] } = data || {};

  if (steps.length === 0) return null;

  const currentStep = steps[activeStep];

  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        
        {/* Left Side: Header & Stepper list */}
        <ScrollReveal animation="fade-in-left" durationMs={800} className="flex-1 w-full space-y-6">
          <div className="flex flex-col gap-1 justify-start items-start max-w-[668px] w-full mx-auto space-y-3">
            <span className="min-w-[122px] h-[38px] rounded-3xl py-2 px-5 text-center flex justify-center items-center backdrop-blur-[2px] bg-primary/5 dark:bg-primary/10 text-[#ea692d] text-sm font-semibold shadow-sm border border-primary/10">
              {tag}
            </span>
            <h2 className="font-heading font-black text-[32px] md:text-[56px] md:leading-[120%] text-foreground text-left">
              {heading_title}
            </h2>
            <p className="font-medium text-[14px] md:text-[16px] md:leading-[150%] text-muted-foreground text-left">
              {paragraph}
            </p>
          </div>

          <VerticalStepper
            steps={steps}
            activeIndex={activeStep}
            onStepClick={setActiveStep}
          />
        </ScrollReveal>

        {/* Right Side: Overlapping Image and Insight Card */}
        <ScrollReveal animation="fade-in-right" delayMs={150} durationMs={800} className="flex-1 w-full lg:max-w-[544px] relative lg:pb-10 pb-48">
          
          {/* Background Showcase Image */}
          <div className="relative w-full max-w-[280px] lg:max-w-[544px] h-[auto] aspect-[544/506] rounded-[13px] overflow-hidden ml-4 lg:ml-0">
            <Image
              src={currentStep.image}
              alt={currentStep.title}
              fill
              sizes="(max-width: 1024px) 100vw, 544px"
              className="object-cover"
            />
          </div>

          {/* Overlapping Text Card */}
          <div className="absolute w-full max-w-[440px] lg:max-h-[450px] h-full top-10 md:top-[147px] -left-2 md:-left-[90px] p-[1px] rounded-[24px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 z-10 transition-all duration-300">
            <div className="w-full h-[390px] lg:h-full px-4 py-6 md:py-10 md:px-9 rounded-[23px] bg-card dark:bg-card/95 flex flex-col shadow-lg backdrop-blur-md">
              
              <div>
                <h3 className="font-heading font-semibold text-[24px] leading-[30px] text-foreground">
                  {currentStep.title}
                </h3>
                <p className="text-muted-foreground text-[14px] md:text-[16px] leading-[140%] mt-1">
                  {currentStep.description}
                </p>
              </div>

              {/* Checklists */}
              <div className="flex flex-col justify-between gap-6 md:gap-8 md:mt-8 mt-6">
                <ul className="flex flex-col gap-3">
                  {currentStep.items?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-foreground/90 font-medium">
                      <span className="flex items-center justify-center size-5 rounded-full bg-[#ea692d] text-white shrink-0 mt-0.5 shadow-sm">
                        <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="leading-[135%] text-[14px] md:text-[16px]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Trigger */}
                <button className="inline-flex items-center gap-1 font-heading text-[16px] font-medium text-foreground hover:text-primary transition-colors group/suggestions">
                  Get More Suggestions 
                  <svg className="size-4 transition-transform duration-200 group-hover/suggestions:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
};

export default PodcastInsight;
