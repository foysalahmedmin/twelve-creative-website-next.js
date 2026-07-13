"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode; // For actions like "View all"
  className?: string;
  align?: "left" | "center";
  centeredOnMobile?: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

// Actions (right-aligned button) slide in from the right for a subtle distinction.
const actionVariants: Variants = {
  hidden: { opacity: 0, x: 18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export const SectionHeader = ({
  label,
  title,
  description,
  children,
  className,
  align = "left",
  centeredOnMobile,
}: SectionHeaderProps) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -10% 0px" }}
      variants={containerVariants}
      className={cn(
        "mb-[2.5em] flex flex-row items-end justify-between gap-[1em] lg:mb-[3em]",
        align === "center" &&
          "flex-col items-center text-center sm:items-center",
        centeredOnMobile &&
          "flex-col items-center text-center sm:flex-row sm:items-end sm:text-left",
        className,
      )}
    >
      <div
        className={cn(
          "max-w-2xl space-y-[0.5em] -mb-2.5 sm:mb-0",
          align === "center" && "mx-auto",
          centeredOnMobile && "mx-auto sm:mx-0",
        )}
      >
        {label && (
          <motion.div
            variants={childVariants}
            className={cn(
              "flex items-center",
              align === "center" && "justify-center",
              centeredOnMobile && "justify-center sm:justify-start",
            )}
          >
            <span className="border-foreground/25 text-foreground inline-flex items-center rounded-md border px-[0.7em] py-[0.3em] text-[0.7em] font-bold uppercase tracking-[0.12em]">
              {label}
            </span>
          </motion.div>
        )}
        <motion.h2
          variants={childVariants}
          className="font-heading text-foreground text-[1.6em] leading-[1.05] font-black tracking-tight sm:text-[2em] lg:text-[2.25em]"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            variants={childVariants}
            className="text-muted-foreground hidden text-[1em] leading-relaxed font-medium sm:block lg:text-[1.125em]"
          >
            {description}
          </motion.p>
        )}
      </div>
      {children && (
        <motion.div variants={actionVariants} className="shrink-0">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};
