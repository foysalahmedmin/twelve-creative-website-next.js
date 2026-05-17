export interface IInsightStep {
  title: string;
  description: string;
  image: string;
  items: string[];
}

export const CANVAS_PODCAST_INSIGHT_DATA = {
  tag: "Podcast Mastery",
  heading_title: "How We Engineer High-Impact Show Audits",
  paragraph: "Creating a premium podcast requires more than hit record. We structure an engaging journey that keeps listeners coming back.",
  steps: [
    {
      title: "Show Hook & Framing",
      description: "Grab attention in the first 15 seconds. Define an irresistible episode hook structure that prevents early drop-offs.",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=768&h=552&fit=crop&auto=format",
      items: [
        "15-second hyper-engaging intro teaser",
        "Clear statement of key takeaway value",
        "Pacing tailored for target listener segments",
      ],
    },
    {
      title: "Dynamic Segment Control",
      description: "Avoid dull moments. We split episodes into snappy segments to maintain listener momentum and ad transition slots.",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=768&h=552&fit=crop&auto=format",
      items: [
        "Custom musical audio cues & transition beds",
        "Strategic sponsor callout integration",
        "Fast-paced conversational dynamic editing",
      ],
    },
    {
      title: "Omnichannel Repurposing",
      description: "Multiply show impact. We slice full episodes into high-yield micro-clips for social platforms like TikTok and Reels.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=552&fit=crop&auto=format",
      items: [
        "8-12 premium 9:16 short-form video cutdowns",
        "Highly engaging kinetic custom subtitles",
        "SEO-optimized audio transcription writeups",
      ],
    },
    {
      title: "Audience Monetization",
      description: "Convert listeners into buyers. We create custom sales funnel integrations mapping directly from podcast descriptions.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=768&h=552&fit=crop&auto=format",
      items: [
        "Seamless digital product integration",
        "Direct-response audio CTAs",
        "CRM syncing from specialized lead magnets",
      ],
    },
  ] as IInsightStep[],
};
