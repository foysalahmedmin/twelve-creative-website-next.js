export interface IFeatureItem {
  icon: string;
  alt: string;
  title: string;
  description: string;
}

export const CANVAS_WHY_CHOOSE_US_DATA = {
  tag: "Why Us",
  heading_part1: "Why Brands Choose Twelve Creative",
  heading_part2: "Our Core Standards",
  paragraph: "We don't just edit clips or launch landing pages. We install complete positioning, cinematic production, and automated systems that move business metrics forward.",
  whychooseus_items: [
    {
      icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop&auto=format",
      alt: "strategy",
      title: "Positioning First",
      description: "We clarify your brand value before a single pixel is edited or a line of copy is written. Every asset has a job to do.",
    },
    {
      icon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=64&h=64&fit=crop&auto=format",
      alt: "cinematic",
      title: "Cinematic Quality",
      description: "Our high-end, premium editing pacing and cinematic footage styling guarantee you look like a market leader.",
    },
    {
      icon: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop&auto=format",
      alt: "systems",
      title: "Automated Systems",
      description: "We hook your marketing directly into custom CRMs and notification sequences so no lead is left behind.",
    },
    {
      icon: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=64&h=64&fit=crop&auto=format",
      alt: "analytics",
      title: "Data-Driven Scaling",
      description: "We don't guess. We analyze content performance metrics and double down on formats that bring highest ROI.",
    },
    {
      icon: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=64&h=64&fit=crop&auto=format",
      alt: "team",
      title: "Dedicated Producers",
      description: "You get a dedicated creative director managing your account. No junior hand-offs, only high-level execution.",
    },
    {
      icon: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=64&h=64&fit=crop&auto=format",
      alt: "speed",
      title: "Rapid Iteration",
      description: "Time is money. We deploy fast feedback loops ensuring content is adjusted and launched within 48-hour turnarounds.",
    }
  ] as IFeatureItem[],
};
