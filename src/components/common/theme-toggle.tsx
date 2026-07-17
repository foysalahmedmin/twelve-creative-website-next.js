"use client";

import { cn } from "@/lib/utils";
import {
  ComputerIcon,
  Moon01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEME_OPTIONS = [
  { value: "system", label: "System", icon: ComputerIcon },
  { value: "light", label: "White", icon: Sun01Icon },
  { value: "dark", label: "Dark", icon: Moon01Icon },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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

  const activeTheme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  const currentTheme = THEME_OPTIONS.find(
    (option) => option.value === activeTheme,
  )!;
  const currentIndex = THEME_OPTIONS.findIndex(
    (option) => option.value === activeTheme,
  );
  const nextTheme = THEME_OPTIONS[(currentIndex + 1) % THEME_OPTIONS.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme.value)}
      className={cn(
        "border-primary text-primary hover:bg-primary hover:text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95",
        className,
      )}
      aria-label={`Color mode: ${currentTheme.label}. Switch to ${nextTheme.label}`}
      title={`${currentTheme.label} mode · Click for ${nextTheme.label}`}
    >
      <HugeiconsIcon icon={currentTheme.icon} className="h-5 w-5" />
    </button>
  );
}
