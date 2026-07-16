import { cn } from "@/lib/utils";
import React from "react";

/**
 * BrandFrame — the "one of the box" device (BRANDBOOK p.28 / p.13).
 * An outlined rounded-rect frame that overlaps a photo or media block.
 * Wrap any media in it; the frame is a decorative, non-interactive overlay.
 */
export function BrandFrame({
  children,
  tone = "primary",
  inset = false,
  className,
}: {
  children: React.ReactNode;
  /** Stroke color of the frame. */
  tone?: "primary" | "cream" | "foreground";
  /** true → clean inner frame; false (default) → offset frame peeking out. */
  inset?: boolean;
  className?: string;
}) {
  const stroke =
    tone === "primary"
      ? "border-primary"
      : tone === "cream"
        ? "border-[#eaeae4]"
        : "border-foreground";

  return (
    <div className={cn("relative", className)}>
      {children}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute rounded-[18px] border-2",
          inset ? "inset-3" : "top-6 -right-3 -bottom-3 left-6",
          stroke,
        )}
      />
    </div>
  );
}
