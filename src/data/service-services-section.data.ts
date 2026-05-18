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
  label: "What We Build",
  title: "Marketing works better when the pieces are connected.",
  description:
    "Twelve Creative builds the creative, strategic, and operational pieces that help a business move from visibility to revenue.",
  services: [
    {
      service_title: "Positioning & Strategy",
      service_description:
        "Before content, ads, or websites, the business needs to be understood. We define the message, offer, audience, and market angle so the rest of the work has direction.",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=552&fit=crop&auto=format",
      title: "Positioning",
    },
    {
      service_title: "Creative Production",
      service_description:
        "Brand films, founder content, restaurant and real estate features, event coverage, and campaign assets. Creative built to support the business strategy — not fill a calendar.",
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=552&fit=crop&auto=format",
      title: "Creative",
    },
    {
      service_title: "Websites & Landing Pages",
      service_description:
        "A website should explain the business clearly, guide the user, support conversion, and connect to the systems behind it. We build pages designed to convert.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=768&h=552&fit=crop&auto=format",
      title: "Websites",
    },
    {
      service_title: "Ads & Distribution",
      service_description:
        "Paid and organic distribution with clearer intent. Campaigns structured around the audience, offer, creative, and desired action across Meta, email, SMS, and PR.",
      image:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=552&fit=crop&auto=format",
      title: "Distribution",
    },
    {
      service_title: "CRM & Automation",
      service_description:
        "Leads should not disappear after they show interest. We install the backend systems that capture, organize, and follow up — turning attention into a working pipeline.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=768&h=552&fit=crop&auto=format",
      title: "CRM",
    },
    {
      service_title: "Ongoing Growth Partnership",
      service_description:
        "An embedded growth partner for companies without an internal marketing department — translating ideas, events, and offers into organized execution.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=768&h=552&fit=crop&auto=format",
      title: "Growth",
    },
  ] as IServiceItem[],
};
