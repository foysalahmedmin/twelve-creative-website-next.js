import { cn } from "@/lib/utils";
import React from "react";

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
        "border-primary/20 bg-primary/8 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide",
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

export const CenteredSectionHeader = ({
  label,
  title,
  description,
  withDot,
  className,
  titleClassName,
  descriptionClassName,
}: CenteredSectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mx-auto mb-12 flex w-full max-w-4xl flex-col items-center justify-center gap-1 px-4 text-center lg:mb-16",
        className,
      )}
    >
      {/* Glass pill label */}
      <span
        className={cn(
          "text-foreground/80 inline-flex items-center justify-center rounded-full px-5 py-2.5",
          "bg-card/25 ring-foreground/10 ring-1 backdrop-blur-md",
          "text-base leading-[140%] font-normal gap-2",
          "shadow-[inset_0_1px_0_var(--color-card),0_2px_6px_-2px_var(--color-foreground)/8%]",
        )}
      >
        {withDot && (
          <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
        )}
        {label}
      </span>

      {/* Premium heading */}
      <h2
        className={cn(
          "font-heading text-foreground mt-3 text-center text-[36px] leading-[120%] font-medium tracking-tight md:text-[56px] xl:mt-4",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-foreground/75 mt-3 max-w-2xl text-center text-[16px] leading-[150%] md:text-[18px]",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};
