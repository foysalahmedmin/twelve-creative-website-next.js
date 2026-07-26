/**
 * Browser-safe shared-section identifiers used by both admin client forms and
 * server data readers. Keep this module free of Next server-only imports.
 */
export const SHARED_SECTION_KEYS = [
  "difference",
  "why-choose-us",
  "growth-system",
  "scroll-statement",
  "work-with-us",
  "home-services",
  "home-featured-projects",
  "home-industries",
  "testimonials",
  "faq",
  "core-verticals",
  "work-showcase",
  "visual-library",
] as const;

export const SHARED_HEADING_KEYS = [
  "home-services",
  "home-featured-projects",
  "home-industries",
  "testimonials",
  "faq",
  "core-verticals",
  "work-showcase",
  "visual-library",
] as const;

export type SharedSectionKey = (typeof SHARED_SECTION_KEYS)[number];
export type SharedHeadingKey = (typeof SHARED_HEADING_KEYS)[number];

export const SHARED_SECTION_LABELS: Record<SharedSectionKey, string> = {
  difference: "Difference",
  "why-choose-us": "Why Choose Us",
  "growth-system": "Growth System",
  "scroll-statement": "Scroll Statement",
  "work-with-us": "Work With Us",
  "home-services": "Home · Services heading",
  "home-featured-projects": "Home · Featured Projects heading",
  "home-industries": "Home · Industries heading",
  testimonials: "Testimonials heading",
  faq: "FAQ heading",
  "core-verticals": "Core Verticals heading",
  "work-showcase": "Work Showcase heading",
  "visual-library": "Visual Library heading",
};

export const WHY_CHOOSE_US_ICON_KEYS = [
  "strategy",
  "cinematic",
  "connected",
  "systems",
  "outcomes",
  "embedded",
] as const;

export type WhyChooseUsIconKey = (typeof WHY_CHOOSE_US_ICON_KEYS)[number];
