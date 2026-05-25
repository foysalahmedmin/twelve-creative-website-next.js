export const PAGE_HERO_TAG = "page-hero";

export const PAGE_KEYS = [
  "home",
  "about",
  "works",
  "industries",
  "what-we-build",
  "contact",
  "blogs",
  "process",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
  home: "Home",
  about: "About",
  works: "Works",
  industries: "Industries",
  "what-we-build": "What We Build",
  contact: "Contact",
  blogs: "Blogs / Insights",
  process: "Process",
};
