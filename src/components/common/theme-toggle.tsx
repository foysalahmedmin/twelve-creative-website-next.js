"use client";

import { cn } from "@/lib/utils";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Light / dark switch.
 *
 * The control offers exactly two choices, but the system preference is still
 * the starting point: the provider sets defaultTheme="system", so a first-time
 * visitor sees whatever their OS prefers. Toggling stores an explicit choice
 * that overrides the OS until they change it again.
 *
 * `resolvedTheme` is what makes that work — while the stored value is still
 * "system" it reports the mode actually on screen, so the first click always
 * flips to the opposite of what the visitor is looking at.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // The server cannot know the visitor's preference, so hold a neutral
  // placeholder until mount rather than guessing and flashing the wrong icon.
  if (!mounted) {
    return (
      <div
        className={cn(
          "border-border bg-muted/20 h-9 w-9 animate-pulse rounded-xl border",
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const current = isDark
    ? { label: "Dark", icon: Moon01Icon }
    : { label: "Light", icon: Sun01Icon };
  const nextLabel = isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "border-primary text-primary hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95",
        className,
      )}
      aria-label={`Color mode: ${current.label}. Switch to ${nextLabel}`}
      title={`${current.label} mode · Click for ${nextLabel}`}
    >
      <HugeiconsIcon icon={current.icon} className="h-5 w-5" />
    </button>
  );
}
