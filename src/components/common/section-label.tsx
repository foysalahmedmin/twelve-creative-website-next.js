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
}

export const CenteredSectionHeader = ({
  label,
  title,
  description,
  withDot,
  className,
  titleClassName,
}: CenteredSectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mx-auto mb-12 max-w-3xl text-center lg:mb-16",
        className,
      )}
    >
      <SectionLabel withDot={withDot} className="mb-5">
        {label}
      </SectionLabel>
      <h2
        className={cn(
          "font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};
