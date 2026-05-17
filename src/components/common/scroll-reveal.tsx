"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: "fade-in" | "fade-in-up" | "zoom-in" | "slide-in-up";
  delayMs?: number;
  durationMs?: number;
  once?: boolean;
  threshold?: number;
}

export const ScrollReveal = ({
  children,
  animation = "fade-in-up",
  delayMs = 0,
  durationMs = 600,
  once = true,
  threshold = 0.1,
  className,
  ...props
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [once, threshold]);

  const animationClasses = {
    "fade-in": "animate-fade-in",
    "fade-in-up": "animate-fade-in-up",
    "zoom-in": "animate-zoom-in",
    "slide-in-up": "animate-slide-in-up",
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "opacity-0 transition-all duration-300",
        isVisible ? animationClasses[animation] : "opacity-0 translate-y-4",
        className
      )}
      style={{
        animationDelay: `${delayMs}ms`,
        animationDuration: `${durationMs}ms`,
        animationFillMode: "forwards",
      }}
      {...props}
    >
      {children}
    </div>
  );
};
