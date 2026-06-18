"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

export const SectionLabel = ({
  children,
  className,
  withDot = false,
}: SectionLabelProps) => {
  return (
    <span
      className={cn(
        "border-primary/20 bg-primary/8 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-normal uppercase tracking-[0.075em]",
        className,
      )}
    >
      {withDot && (
        <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
      )}
      {children}
    </span>
  );
};

interface CenteredSectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  withDot?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const CenteredSectionHeader = ({
  label,
  title,
  description,
  withDot,
  className,
  titleClassName,
  descriptionClassName,
}: CenteredSectionHeaderProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -10% 0px" }}
      variants={containerVariants}
      className={cn(
        "mx-auto mb-12 flex w-full max-w-4xl flex-col items-center justify-center gap-1 px-4 text-center lg:mb-16",
        className,
      )}
    >
      {/* Glass pill label */}
      <motion.span
        variants={childVariants}
        className={cn(
          "text-foreground/80 inline-flex items-center justify-center rounded-full px-5 py-2.5",
          "bg-card/25 ring-foreground/10 ring-1 backdrop-blur-md",
          "text-xs leading-[140%] font-normal uppercase tracking-[0.075em] gap-2",
          "shadow-[inset_0_1px_0_var(--color-card),0_2px_6px_-2px_var(--color-foreground)/8%]",
        )}
      >
        {withDot && (
          <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
        )}
        {label}
      </motion.span>

      {/* Premium heading */}
      <motion.h2
        variants={childVariants}
        className={cn(
          "font-heading text-foreground mt-3 text-center text-[36px] leading-[120%] font-black tracking-tight md:text-[56px] xl:mt-4",
          titleClassName,
        )}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          variants={childVariants}
          className={cn(
            "text-foreground/75 mt-3 max-w-2xl text-center text-[16px] leading-[150%] md:text-[18px]",
            descriptionClassName,
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};
