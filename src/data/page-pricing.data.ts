export interface IPackageFeature {
  feature: string;
}

export interface IPackage {
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: IPackageFeature[];
}

export const CANVAS_PRICING_DATA = {
  tag: "Pricing Plans",
  heading_part1: "Simple, Value-Driven",
  heading_part2: "Pricing Plans",
  paragraph: "Choose a plan tailored to your execution velocity. No hidden retainer fees or complex hourly breakdowns.",
  packages: [
    {
      name: "Starter Growth",
      description: "Perfect for growing brands looking to establish their market presence.",
      price: 1999,
      billing_cycle: "month",
      features: [
        { feature: "Dedicated Producer & Content strategist" },
        { feature: "8 high-end short-form video assets" },
        { feature: "Custom landing page optimization" },
        { feature: "1 CRM workflow sequence setup" },
      ],
    },
    {
      name: "Market Leader",
      description: "Our most popular setup for teams building high-impact brand dominance.",
      price: 3999,
      billing_cycle: "month",
      features: [
        { feature: "Everything in Starter Growth" },
        { feature: "16 premium short-form videos" },
        { feature: "Full conversion-focused website overhaul" },
        { feature: "Complete automated SMS & email retargeting" },
        { feature: "Weekly strategic consulting & performance reviews" },
      ],
    },
    {
      name: "Enterprise Engine",
      description: "Custom built growth engines for high-volume corporate organizations.",
      price: 7999,
      billing_cycle: "month",
      features: [
        { feature: "Dedicated content and systems team" },
        { feature: "Unlimited asset revisions" },
        { feature: "Custom product explainer animations" },
        { feature: "Full-stack automated operations audit" },
        { feature: "24/7 Slack and video support channels" },
      ],
    },
  ] as IPackage[],
};
