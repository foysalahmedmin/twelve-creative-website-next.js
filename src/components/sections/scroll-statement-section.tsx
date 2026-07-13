"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Fragment, useRef } from "react";

interface Segment {
  text: string;
  /** Render this run in the brand primary orange. */
  highlight?: boolean;
}

interface ScrollStatementSectionProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  paragraphs?: Segment[][];
}

const DEFAULT_TITLE =
  "Make the business understood. Then construct the system that converts attention into revenue.";

const DEFAULT_PARAGRAPHS: Segment[][] = [
  [
    { text: "Positioning, " },
    { text: "cinema-level creative", highlight: true },
    {
      text: ", and distribution are built together with the systems behind them. ",
    },
    { text: "CRM, automation, and conversion logic", highlight: true },
    { text: " integrated from the start." },
  ],
  [
    {
      text: "Demand is generated, qualified, and directed into revenue. The result is a business that is understood immediately and ",
    },
    { text: "scales with control", highlight: true },
    { text: "." },
  ],
];

// A single headline character that lightens from dim to bright across its slice
// of the scroll range. Because opacity is bound to `useScroll` progress, it
// reverses automatically when the user scrolls back up.
function RevealChar({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.26, 1]);
  return (
    <motion.span style={{ opacity }} className="transition-none">
      {children}
    </motion.span>
  );
}

export function ScrollStatementSection({
  className,
  eyebrow,
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
}: ScrollStatementSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  // Progress runs 0 → 1 as the headline travels up through the viewport. The
  // wide offset spreads the reveal over a long scroll distance so it plays out
  // slowly and gradually rather than snapping.
  const { scrollYProgress } = useScroll({
    target: titleRef,
    offset: ["start 0.95", "start 0.15"],
  });

  const words = title.split(" ");
  // Total non-space characters — the reveal is mapped across these.
  const totalChars = title.replace(/\s/g, "").length;
  // Each character fades over a window of a few characters, so several are
  // mid-transition at once — a soft wave instead of a hard per-character edge.
  const softWindow = 5;

  let charIndex = 0;

  return (
    <section
      className={cn(
        // Always-dark statement block — matches the hero above it.
        "bg-[#131C20] text-[#EAEAE4]",
        "border-y border-white/10",
        "py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      <div className="container max-w-5xl">
        {eyebrow ? (
          <span className="text-primary mb-8 inline-block text-xs font-bold tracking-[0.2em] uppercase">
            {eyebrow}
          </span>
        ) : null}

        {/* Headline — character-by-character scroll reveal */}
        <h2
          ref={titleRef}
          className="font-heading text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-[68px]"
        >
          {reduceMotion
            ? title
            : words.map((word, wi) => (
                <Fragment key={wi}>
                  {/* Whole word stays together so headlines never break mid-word */}
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((char) => {
                      const i = charIndex++;
                      const start = i / totalChars;
                      const end = Math.min(1, (i + softWindow) / totalChars);
                      return (
                        <RevealChar
                          key={i}
                          progress={scrollYProgress}
                          range={[start, end]}
                        >
                          {char}
                        </RevealChar>
                      );
                    })}
                  </span>
                  {wi < words.length - 1 ? " " : null}
                </Fragment>
              ))}
        </h2>

        {/* Body — static, with brand-orange emphasis */}
        <div className="mt-10 max-w-2xl space-y-6 lg:mt-14">
          {paragraphs.map((segments, pi) => (
            <p
              key={pi}
              className="text-base leading-relaxed text-[#EAEAE4]/80 sm:text-lg"
            >
              {segments.map((seg, si) =>
                seg.highlight ? (
                  <span key={si} className="text-primary font-medium">
                    {seg.text}
                  </span>
                ) : (
                  <span key={si}>{seg.text}</span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScrollStatementSection;
