export interface IInsightStep {
  title: string;
  description: string;
  image: string;
  items: string[];
}

/**
 * Variable name preserved for legacy imports. Content adapted to Twelve Creative —
 * a deep-dive into how we structure a growth system end-to-end.
 */
export const CANVAS_PODCAST_INSIGHT_DATA = {
  tag: "Inside the Build",
  heading_title: "How we structure a growth system end-to-end.",
  paragraph:
    "Most marketing fails because the pieces are not connected. Here is how Twelve Creative builds positioning, creative, distribution, and conversion as one working system.",
  steps: [
    {
      title: "Positioning the Business",
      description:
        "Before content, ads, or websites, we clarify what the business is, who it serves, and the angle the market needs to believe.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=552&fit=crop&auto=format",
      items: [
        "Brand messaging and offer structure",
        "Founder or company positioning",
        "Market differentiation and angle",
      ],
    },
    {
      title: "Creative Production",
      description:
        "We produce the assets that make the business feel credible, relevant, and worth attention — from brand films to founder content.",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=552&fit=crop&auto=format",
      items: [
        "Brand films and campaign assets",
        "Founder-led and event coverage",
        "Restaurant, real estate, and aviation content",
      ],
    },
    {
      title: "Distribution with Intent",
      description:
        "Creative only matters if it reaches the right people. We design campaigns around the audience, offer, and desired action.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=552&fit=crop&auto=format",
      items: [
        "Meta ads and retargeting",
        "Email and SMS campaigns",
        "Launch and PR coordination",
      ],
    },
    {
      title: "Conversion Systems",
      description:
        "Attention needs somewhere to go. We install landing pages, CRM, and automations that capture demand and follow up properly.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=768&h=552&fit=crop&auto=format",
      items: [
        "Landing pages and lead capture",
        "CRM, automations, and follow-up",
        "Tracking and reporting",
      ],
    },
  ] as IInsightStep[],
};
