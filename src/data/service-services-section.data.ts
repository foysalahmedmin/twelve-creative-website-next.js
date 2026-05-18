export interface IServiceItem {
  service_title: string;
  service_description: string;
  image: string;
  title: string;
}

export type TServiceServicesData = {
  label: string;
  title: string;
  description: string;
  services: IServiceItem[];
};

export const SERVICE_SERVICES_DATA: TServiceServicesData = {
  label: "Our Services",
  title: "Comprehensive Production And Strategy Solutions",
  description:
    "Explore our modular architecture. Scale up production resources exactly when your brand requires them.",
  services: [
    {
      service_title: "Cinematic Film Production",
      service_description:
        "End-to-end documentary and commercial production that elevates your brand narrative and positions you as a market leader.",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=552&fit=crop&auto=format",
      title: "Commercial Film",
    },
    {
      service_title: "Podcast Asset Engine",
      service_description:
        "We cut long-form podcasts into dynamic, engaging micro-clips engineered to hijack algorithms across TikTok and Reels.",
      image:
        "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=768&h=552&fit=crop&auto=format",
      title: "Podcast Strategy",
    },
    {
      service_title: "Automated Conversions",
      service_description:
        "Custom web development pipelines connected directly to CRM, stripping away manual follow-ups.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=768&h=552&fit=crop&auto=format",
      title: "Funnel Systems",
    },
    {
      service_title: "Brand Architecture",
      service_description:
        "Strict visual guidelines, exact tone of voice definitions, and positioning rules that make your market impact completely unified.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=768&h=552&fit=crop&auto=format",
      title: "Visual Branding",
    },
    {
      service_title: "B2B Outreach Matrix",
      service_description:
        "Targeted outbound scaling with personalized micro-videos delivered into decision-maker inboxes.",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=768&h=552&fit=crop&auto=format",
      title: "Lead Generation",
    },
    {
      service_title: "Paid Media Acceleration",
      service_description:
        "Direct-response advertising campaigns on Facebook, Instagram, and LinkedIn designed for immediate ROAS.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=552&fit=crop&auto=format",
      title: "Performance Ads",
    },
  ] as IServiceItem[],
};
