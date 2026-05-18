export interface IPackageFeature {
  feature: string;
}

export interface IPackage {
  name: string;
  description: string;
  /** Numeric price (renders as `$X/{billing_cycle}`) OR a label string like "Custom" for by-quote tiers. */
  price: number | string;
  /** Omit for by-quote tiers. */
  billing_cycle?: string;
  features: IPackageFeature[];
  cta_label?: string;
  cta_href?: string;
}

export type TPricingData = {
  label: string;
  title: string;
  description: string;
  packages: IPackage[];
};

/**
 * Twelve Creative offer ladder per project requirements.
 * Pricing is intentionally not displayed — scope, timeline, and investment depend
 * on what needs to be built. The first step is always a conversation.
 */
export const PACKAGES: IPackage[] = [
  {
    name: "Growth Diagnostic",
    description:
      "A focused audit of positioning, website, content, distribution, funnel, CRM, and conversion. Best for companies that need clarity before committing to execution.",
    price: "By quote",
    features: [
      { feature: "Business and audience review" },
      { feature: "Positioning and offer audit" },
      { feature: "Website, funnel, and CRM diagnostic" },
      { feature: "Content and distribution audit" },
      { feature: "Strategic recommendations document" },
    ],
    cta_label: "Request a Diagnostic",
    cta_href: "/contact",
  },
  {
    name: "System Install",
    description:
      "A defined buildout for companies that need a specific marketing system installed — positioning, creative assets, website, CRM, and the connections between them.",
    price: "By quote",
    features: [
      { feature: "Positioning and offer structure" },
      { feature: "Landing page or website build" },
      { feature: "Initial creative assets" },
      { feature: "CRM setup and automations" },
      { feature: "Lead capture and tracking" },
      { feature: "Meta ad setup (optional)" },
    ],
    cta_label: "Build the System",
    cta_href: "/contact",
  },
  {
    name: "Full Growth Partnership",
    description:
      "An embedded relationship for companies without a real internal marketing department. Ongoing positioning, creative, campaigns, distribution, CRM, reporting, and growth strategy.",
    price: "By quote",
    features: [
      { feature: "Embedded strategic operator" },
      { feature: "Ongoing creative production" },
      { feature: "Distribution and campaign management" },
      { feature: "CRM, automation, and reporting" },
      { feature: "Monthly review and refinement" },
      { feature: "Direct line to the team" },
    ],
    cta_label: "Start a Partnership Conversation",
    cta_href: "/contact",
  },
];

export const PRICING_DATA: TPricingData = {
  label: "How We Engage",
  title: "Three ways to work with Twelve Creative.",
  description:
    "Every business is different. The scope, timeline, and investment depend on what needs to be built. The best first step is a conversation.",
  packages: PACKAGES,
};
