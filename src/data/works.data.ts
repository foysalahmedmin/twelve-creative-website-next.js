export interface IMetric {
  label: string;
  value: string;
}

export interface IWorkItem {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  created_at: string;
  metrics: IMetric[];
}

export const WORKS_PAGE_MOCK_DATA: IWorkItem[] = [
  {
    id: "1",
    slug: "sparklabs-scale",
    type: "Growth System",
    title: "How SparkLabs Scaled ARR by 3× in 9 Months",
    description: "SparkLabs came to us with a fragmented marketing strategy. We installed our full-stack CRM integration, developed 12 cinematic short-form video hooks, and built a custom SaaS explainer landing page that completely restructured their outbound pipeline.",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=432&fit=crop&auto=format",
    image_alt: "SparkLabs Dashboard Strategy",
    created_at: "2024-03-15T12:00:00Z",
    metrics: [
      { label: "ARR Growth", value: "3×" },
      { label: "Timeline", value: "9 mo" },
      { label: "Final ARR", value: "$2.4M" },
    ],
  },
  {
    id: "2",
    slug: "empire-rebrand",
    type: "Cinematic Branding",
    title: "Empire Creative: Dominating the Agency Market",
    description: "To stand out in a saturated market, Empire needed more than a new logo. We architected a complete brand positioning guideline, shot a high-end commercial documentary, and rolled out a responsive direct-to-consumer website overhaul.",
    image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=432&fit=crop&auto=format",
    image_alt: "Empire Rebrand Process",
    created_at: "2024-02-22T08:30:00Z",
    metrics: [
      { label: "Bookings", value: "+145%" },
      { label: "Cost Per Lead", value: "-40%" },
      { label: "Timeline", value: "4 mo" },
    ],
  },
  {
    id: "3",
    slug: "novatech-funnel",
    type: "Automation Pipeline",
    title: "NovaTech's Seamless E-Commerce Integration",
    description: "We completely stripped out NovaTech's manual follow-up sequences. By connecting a dynamic custom headless commerce frontend directly to their backend workflows, we captured lost abandoned carts automatically.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=768&h=432&fit=crop&auto=format",
    image_alt: "NovaTech Funnel System",
    created_at: "2023-11-05T14:45:00Z",
    metrics: [
      { label: "Recovery Rate", value: "28%" },
      { label: "Automation", value: "100%" },
      { label: "ROAS", value: "4.2×" },
    ],
  },
];
