"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { cn } from "@/lib/utils";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

// "Expo out" — matches the rest of the site's motion language.
const EASE = [0.16, 1, 0.3, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");

// ── Shared header ─────────────────────────────────────────────────────────
function SectionHeader({
  tag,
  title,
  paragraph,
  className,
}: {
  tag: string;
  title: string;
  paragraph: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <span className="bg-primary/5 dark:bg-primary/10 border-primary/10 text-primary inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold tracking-wide backdrop-blur-[2px]">
        {tag}
      </span>
      <h2 className="font-heading text-foreground text-3xl font-black tracking-tight md:text-4xl lg:text-[44px] lg:leading-[1.1]">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-xl text-sm font-medium md:text-base">
        {paragraph}
      </p>
    </div>
  );
}

// ── Checklist with one-by-one cascade ─────────────────────────────────────
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

function Checklist({ items, animated }: { items: string[]; animated: boolean }) {
  return (
    <motion.ul
      variants={animated ? listVariants : undefined}
      initial={animated ? "hidden" : false}
      animate={animated ? "show" : false}
      className="grid gap-3"
    >
      {items.map((item, idx) => (
        <motion.li
          key={idx}
          variants={animated ? itemVariants : undefined}
          className="text-foreground/90 flex items-start gap-3 text-sm font-medium md:text-base"
        >
          <span className="from-primary-from to-primary-to mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-sm">
            <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={3} />
          </span>
          <span className="leading-snug">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

// ── Media + copy panel for the active stage ───────────────────────────────
function StagePanel({
  step,
  index,
  total,
  animated,
}: {
  step: IInsightStep;
  index: number;
  total: number;
  animated: boolean;
}) {
  return (
    <div>
      <div className="border-border/60 relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border shadow-xl">
        <Image
          src={step.image}
          alt={step.title}
          fill
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-cover"
        />
        <div className="from-background/30 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="mt-7">
        <span className="font-heading text-primary text-xs font-bold tracking-[0.2em]">
          STAGE {pad(index + 1)} / {pad(total)}
        </span>
        <h3 className="font-heading text-foreground mt-2 text-2xl font-black tracking-tight md:text-3xl">
          {step.title}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          {step.description}
        </p>
        <div className="mt-6">
          <Checklist items={step.items} animated={animated} />
        </div>
      </div>
    </div>
  );
}

// ── Enhanced: pinned scroll-driven stage (lg+, motion allowed) ────────────
function PinnedStages({
  tag,
  heading_title,
  paragraph,
  steps,
}: PodcastInsightProps["data"]) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const total = steps.length;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const scrollToStage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + ((i + 0.5) / total) * distance,
      behavior: "smooth",
    });
  };

  const current = steps[active];

  return (
    <div ref={trackRef} style={{ height: `${total * 90}vh` }} className="relative">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* ambient warm glow */}
        <div className="bg-primary/5 pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full blur-3xl" />

        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
            {/* LEFT — header + stage index with filling spine */}
            <div>
              <SectionHeader
                tag={tag}
                title={heading_title}
                paragraph={paragraph}
              />

              <div className="relative mt-10 flex flex-col gap-5">
                {/* spine track + fill */}
                <div className="bg-border absolute bottom-3 left-[17px] top-3 w-0.5" />
                <motion.div
                  style={{ scaleY: scrollYProgress }}
                  className="from-primary-from to-primary-to absolute bottom-3 left-[17px] top-3 w-0.5 origin-top bg-gradient-to-b"
                />

                {steps.map((step, i) => {
                  const isActive = i === active;
                  const isDone = i < active;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToStage(i)}
                      className="group focus-visible:ring-primary/50 relative z-10 flex items-center gap-4 rounded-xl text-left focus-visible:outline-none focus-visible:ring-2"
                    >
                      <span
                        className={cn(
                          "font-heading flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all duration-300",
                          isActive &&
                            "from-primary-from to-primary-to border-transparent bg-gradient-to-br text-white shadow-md",
                          isDone &&
                            "border-primary/30 bg-primary/10 text-primary",
                          !isActive &&
                            !isDone &&
                            "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className={cn(
                          "text-[17px] transition-colors duration-300",
                          isActive
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground group-hover:text-foreground/80 font-medium",
                        )}
                      >
                        {step.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — cross-fading media + copy with ghost numeral */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="font-heading text-primary/10 pointer-events-none absolute -top-16 right-0 z-0 select-none text-[10rem] font-black leading-none"
                  aria-hidden
                >
                  {pad(active + 1)}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative z-10"
                >
                  <StagePanel
                    step={current}
                    index={active}
                    total={total}
                    animated
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Fallback: stacked numbered timeline (mobile / reduced motion) ─────────
function StackedStages({
  tag,
  heading_title,
  paragraph,
  steps,
}: PodcastInsightProps["data"]) {
  const total = steps.length;
  return (
    <div className="container py-16 sm:py-20 lg:py-24">
      <SectionHeader
        tag={tag}
        title={heading_title}
        paragraph={paragraph}
        className="mx-auto max-w-2xl items-center text-center [&>h2]:text-center [&>p]:text-center"
      />

      <div className="relative mt-12 flex flex-col gap-8">
        {/* connecting spine */}
        <div className="bg-border absolute bottom-6 left-[18px] top-6 w-0.5" />

        {steps.map((step, i) => (
          <ScrollReveal key={i} animation="fade-in-up" delayMs={i * 60} durationMs={700}>
            <div className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 md:gap-6">
              <span className="font-heading from-primary-from to-primary-to z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md">
                {pad(i + 1)}
              </span>
              <div className="border-border/60 bg-card rounded-2xl border p-5 shadow-sm md:p-6">
                <div className="border-border/60 relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-xl border">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
                <span className="font-heading text-primary text-xs font-bold tracking-[0.2em]">
                  STAGE {pad(i + 1)} / {pad(total)}
                </span>
                <h3 className="font-heading text-foreground mt-1.5 text-xl font-black tracking-tight md:text-2xl">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
                  {step.description}
                </p>
                <div className="mt-5">
                  <Checklist items={step.items} animated={false} />
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────
export const PodcastInsight = ({ data, className }: PodcastInsightProps) => {
  const reduceMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { steps = [] } = data || {};
  if (steps.length === 0) return null;

  // Pinned scrollytelling only where it reads well: large screens with motion.
  const enhanced = isDesktop && !reduceMotion;

  return (
    <section className={cn("bg-background relative", className)}>
      {enhanced ? <PinnedStages {...data} /> : <StackedStages {...data} />}
    </section>
  );
};

export default PodcastInsight;
