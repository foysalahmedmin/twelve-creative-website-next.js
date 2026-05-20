"use client";

/**
 * Scroll-triggered reveal wrapper.
 *
 * Backed by framer-motion's `whileInView` for smooth, GPU-accelerated entry
 * animations. The public API is identical to the previous CSS-based version
 * — every existing `<ScrollReveal animation="..." delayMs={...} durationMs={...}>`
 * call keeps working without changes. Three new directional animations
 * (`fade-in-left`, `fade-in-right`, `fade-in-down`) are added for sections
 * that benefit from a side-entry feel.
 *
 * Respects `prefers-reduced-motion` — users with that setting see the final
 * state immediately, with no movement.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

export type ScrollRevealAnimation =
  | "fade-in"
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "zoom-in"
  | "slide-in-up";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollRevealAnimation;
  /** Delay before the animation starts, in milliseconds. */
  delayMs?: number;
  /** How long the animation runs, in milliseconds. */
  durationMs?: number;
  /** When true (default), the animation runs once and never replays. */
  once?: boolean;
  /** Fraction of element that must be visible before triggering (0–1). */
  threshold?: number;
  className?: string;
  /** Optional id for in-page anchors. */
  id?: string;
}

// "Expo out" easing — feels smooth and confident, the gold standard for
// professional product motion.
const EASE = [0.16, 1, 0.3, 1] as const;

const DISTANCE = 28;
const STRONG_DISTANCE = 40;

const buildVariants = (animation: ScrollRevealAnimation): Variants => {
  const visible = { opacity: 1, x: 0, y: 0, scale: 1 };
  switch (animation) {
    case "fade-in":
      return { hidden: { opacity: 0 }, visible };
    case "fade-in-up":
      return { hidden: { opacity: 0, y: DISTANCE }, visible };
    case "fade-in-down":
      return { hidden: { opacity: 0, y: -DISTANCE }, visible };
    case "fade-in-left":
      return { hidden: { opacity: 0, x: -DISTANCE }, visible };
    case "fade-in-right":
      return { hidden: { opacity: 0, x: DISTANCE }, visible };
    case "zoom-in":
      return { hidden: { opacity: 0, scale: 0.95 }, visible };
    case "slide-in-up":
      return { hidden: { opacity: 0, y: STRONG_DISTANCE }, visible };
    default:
      return { hidden: { opacity: 0, y: DISTANCE }, visible };
  }
};

export const ScrollReveal = ({
  children,
  animation = "fade-in-up",
  delayMs = 0,
  durationMs = 700,
  once = true,
  threshold = 0.15,
  className,
  id,
}: ScrollRevealProps) => {
  const reduceMotion = useReducedMotion();
  const variants = React.useMemo(
    () => buildVariants(animation),
    [animation],
  );

  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{
        once,
        amount: threshold,
        // Trigger slightly before the element is fully in view — feels more
        // natural than waiting for full visibility.
        margin: "0px 0px -10% 0px",
      }}
      variants={variants}
      transition={{
        duration: reduceMotion ? 0 : durationMs / 1000,
        delay: reduceMotion ? 0 : delayMs / 1000,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
};
