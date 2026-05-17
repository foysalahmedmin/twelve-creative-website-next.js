export type TServiceIconKey =
  | "positioning"
  | "creative"
  | "distribution"
  | "websites"
  | "automation"
  | "growth";

export type TService = {
  id: string;
  icon: TServiceIconKey;
  title: string;
  description: string;
  highlights: string[];
  thumbnail_src: string;
  href: string;
};

/**
 * Placeholder thumbnails use Unsplash. Replace `thumbnail_src` per service
 * with real Twelve Creative imagery when available.
 */
export const SERVICES_DATA: TService[] = [
  {
    id: "positioning",
    icon: "positioning",
    title: "Positioning & Strategy",
    description:
      "We clarify what the business is, who it serves, why it matters, and how it should be presented to the market.",
    highlights: [
      "Brand messaging",
      "Offer structure",
      "Sales positioning",
      "Market differentiation",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#positioning",
  },
  {
    id: "creative",
    icon: "creative",
    title: "Creative Production",
    description:
      "We create the visual assets that make the business feel credible, relevant, and worth paying attention to.",
    highlights: [
      "Video production",
      "Photography",
      "Short-form content",
      "Brand films",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#creative",
  },
  {
    id: "distribution",
    icon: "distribution",
    title: "Ads & Distribution",
    description:
      "Creative only matters if it reaches the right people with the right intention. We make sure attention lands.",
    highlights: [
      "Meta ads",
      "Retargeting",
      "Email & SMS",
      "Launch campaigns",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#distribution",
  },
  {
    id: "websites",
    icon: "websites",
    title: "Websites & Landing Pages",
    description:
      "A website should explain the business clearly, guide the user, and connect to the systems behind it.",
    highlights: [
      "Website copy",
      "Landing pages",
      "Campaign pages",
      "Conversion structure",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#websites",
  },
  {
    id: "automation",
    icon: "automation",
    title: "CRM & Automation",
    description:
      "Leads should not disappear after they show interest. We install backend systems that capture and follow up.",
    highlights: [
      "CRM setup",
      "Lead pipelines",
      "Email & SMS sequences",
      "Tracking & reporting",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#automation",
  },
  {
    id: "growth",
    icon: "growth",
    title: "Ongoing Growth Support",
    description:
      "We work as an embedded growth partner, translating ideas, events, and offers into organized execution.",
    highlights: [
      "Strategic operator",
      "Creative direction",
      "Campaign management",
      "Reporting & review",
    ],
    thumbnail_src:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=768&h=552&fit=crop&auto=format",
    href: "/what-we-build#growth",
  },
];
