export type TFeatureIconKey =
  | "strategy"
  | "cinematic"
  | "connected"
  | "systems"
  | "outcomes"
  | "embedded";

export type TFeature = {
  id: string;
  icon: TFeatureIconKey;
  title: string;
  description: string;
};

export type TWhyChooseUsData = {
  label: string;
  title: string;
  description: string;
  features: TFeature[];
};

export const FEATURES: TFeature[] = [
  {
    id: "strategy",
    icon: "strategy",
    title: "Strategy in the same room",
    description:
      "Creative decisions are made next to business decisions, not in isolation from them.",
  },
  {
    id: "cinematic",
    icon: "cinematic",
    title: "Cinematic creative",
    description:
      "15+ years of production experience shaping content that feels credible and worth attention.",
  },
  {
    id: "connected",
    icon: "connected",
    title: "Distribution with intent",
    description:
      "Campaigns built around the audience, offer, and the action we want them to take.",
  },
  {
    id: "systems",
    icon: "systems",
    title: "Systems that actually run",
    description:
      "CRM, automations, and follow-up that capture demand instead of letting it leak out.",
  },
  {
    id: "outcomes",
    icon: "outcomes",
    title: "Outcomes over activity",
    description:
      "The work is measured by whether the business becomes easier to understand and easier to buy from.",
  },
  {
    id: "embedded",
    icon: "embedded",
    title: "Embedded partnership",
    description:
      "We operate as the marketing department the business needs, not a vendor at arm's length.",
  },
];

export const WHY_CHOOSE_US_DATA: TWhyChooseUsData = {
  label: "Why Choose Us",
  title: "Why Brands Choose Twelve Creative",
  description:
    "We don't just edit clips or launch landing pages. We install complete positioning, cinematic production, and automated systems that move business metrics forward.",
  features: FEATURES,
};
