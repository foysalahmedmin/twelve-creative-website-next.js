"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  withDot?: boolean;
}

// Signature brand device (BRANDBOOK): outlined rounded-rect chip — hairline
// border, bold ALL-CAPS label. NOT a filled pill.
export const SectionLabel = ({
  children,
  className,
  withDot = false,
}: SectionLabelProps) => {
  return (
    <span
      className={cn(
        "border-foreground/25 text-foreground inline-flex items-center gap-2 rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase",
        className,
      )}
    >
      {withDot && <span className="bg-primary size-1.5 rounded-full" />}
      {children}
    </span>
  );
};

interface CenteredSectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  withDot?: boolean;
  tone?: "default" | "inverse";
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
  tone = "default",
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
      {/* Outlined chip eyebrow (brand device) */}
      <motion.span
        variants={childVariants}
        className={cn(
          "border-foreground/25 text-foreground inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1",
          "text-[11px] leading-none font-bold tracking-[0.12em] uppercase",
          tone === "inverse" &&
            "border-primary-foreground/40 text-primary-foreground",
        )}
      >
        {withDot && (
          <span
            className={cn(
              "size-1.5 rounded-full",
              tone === "inverse" ? "bg-primary-foreground" : "bg-primary",
            )}
          />
        )}
        {label}
      </motion.span>

      {/* Heavy headline — tight leading (brandbook p.24) */}
      <motion.h2
        variants={childVariants}
        className={cn(
          "font-heading text-foreground mt-4 text-center text-[34px] leading-[1.05] font-black tracking-tight md:text-[56px] xl:mt-5",
          tone === "inverse" && "text-primary-foreground",
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
            "text-muted-foreground mt-4 max-w-2xl text-center text-[16px] leading-[150%] md:text-[18px]",
            tone === "inverse" && "text-primary-foreground font-medium",
            descriptionClassName,
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};
