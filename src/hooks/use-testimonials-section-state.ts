"use client";

import { useSyncExternalStore } from "react";

export const TESTIMONIALS_SECTION_ID = "testimonials";

type TestimonialsSectionState = { has: boolean; active: boolean };

const NONE: TestimonialsSectionState = { has: false, active: false };
let current: TestimonialsSectionState = NONE;

function subscribe(onStoreChange: () => void): () => void {
  let target: Element | null = null;
  let intersectionObserver: IntersectionObserver | null = null;

  const setSnapshot = (next: TestimonialsSectionState) => {
    if (next.has === current.has && next.active === current.active) return;
    current = next;
    onStoreChange();
  };

  // Re-checks whenever the page's DOM changes (client-side navigation swaps
  // the whole page) — a #testimonials section can appear or disappear
  // without this hook's consumer re-rendering on its own.
  const sync = () => {
    const next = document.getElementById(TESTIMONIALS_SECTION_ID);
    if (next === target) return;
    target = next;
    intersectionObserver?.disconnect();
    intersectionObserver = null;

    if (!target) {
      setSnapshot(NONE);
      return;
    }
    setSnapshot({ has: true, active: false });
    intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        const isVisible =
          entry.isIntersecting && entry.intersectionRect.height > 20;
        setSnapshot({ has: true, active: isVisible });
      },
      { rootMargin: "-10% 0px -20% 0px" },
    );
    intersectionObserver.observe(target);
  };

  sync();
  const mutationObserver = new MutationObserver(sync);
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    mutationObserver.disconnect();
    intersectionObserver?.disconnect();
    target = null;
    current = NONE;
  };
}

function getSnapshot(): TestimonialsSectionState {
  return current;
}

function getServerSnapshot(): TestimonialsSectionState {
  return NONE;
}

/** Whether the current page renders a `#testimonials` section, and whether
 * it's scrolled into view — drives the nav's conditional Testimonials link
 * and its scroll-spy active state. */
export function useTestimonialsSectionState(): TestimonialsSectionState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
