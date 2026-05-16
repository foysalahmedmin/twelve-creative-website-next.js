import { cn } from "@/lib/utils";
import React from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  children?: React.ReactNode; // For actions like "View all"
  className?: string;
  align?: "left" | "center";
  centeredOnMobile?: boolean;
}

export const SectionHeader = ({
  label,
  title,
  description,
  children,
  className,
  align = "left",
  centeredOnMobile,
}: SectionHeaderProps) => {
  return (
    <div
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
          <div
            className={cn(
              "flex items-center",
              align === "center" && "justify-center",
              centeredOnMobile && "justify-center sm:justify-start",
            )}
          >
            <span className="border-primary text-primary border-l-[0.125em] pl-[0.5em] text-[0.75em] font-bold tracking-wider uppercase">
              {label}
            </span>
          </div>
        )}
        <h2 className="text-foreground text-[1.5em] sm:leading-tight leading-none font-bold tracking-tight sm:text-[1.875em] lg:text-[2em]">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground hidden text-[1em] leading-relaxed font-medium sm:block lg:text-[1.125em]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
};
