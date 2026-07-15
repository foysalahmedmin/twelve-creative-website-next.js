"use client";

import { cn } from "@/lib/utils";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
          "border-border bg-muted/20 h-9 w-9 animate-pulse rounded-xl border md:h-11 md:w-11",
          className,
        )}
      />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentIcon = theme === "dark" ? Moon01Icon : Sun01Icon;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "border-primary text-primary hover:border-primary hover:text-primary flex h-9 w-9 items-center justify-center rounded-lg border transition-all active:scale-95",
        className,
      )}
      aria-label="Toggle theme"
    >
      <HugeiconsIcon icon={currentIcon} className="h-5 w-5" />
    </button>
  );
}
