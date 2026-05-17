export type TServiceIconKey =
  | "positioning"
  | "creative"
  | "distribution"
  | "conversion"
  | "growth";

export type TService = {
  id: string;
  icon: TServiceIconKey;
  title: string;
  description: string;
  highlights: string[];
  href: string;
};

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
    href: "/what-we-build#distribution",
  },
  {
    id: "conversion",
    icon: "conversion",
    title: "Websites & CRM Systems",
    description:
      "Attention needs somewhere to go. We install the backend that captures, organizes, and follows up on demand.",
    highlights: [
      "Landing pages",
      "CRM setup",
      "Automations",
      "Tracking & reporting",
    ],
    href: "/what-we-build#conversion",
  },
  {
    id: "growth",
    icon: "growth",
    title: "Ongoing Growth Support",
    description:
      "We work as an embedded growth partner, translating ideas, events, and offers into organized marketing execution.",
    highlights: [
      "Strategic operator",
      "Creative direction",
      "Campaign management",
      "Reporting & review",
    ],
    href: "/what-we-build#growth",
  },
];
