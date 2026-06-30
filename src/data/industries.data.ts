export type TIndustryIconKey =
  | "hospitality"
  | "real-estate"
  | "aviation"
  | "professional-services";

export type TIndustry = {
  id: string;
  icon: TIndustryIconKey;
  name: string;
  headline: string;
  description: string;
  image: string;
  work: string[];
  href: string;
  /** Resolved promo video URL (when configured in the admin panel). */
  videoSrc?: string;
  /** Resolved poster used as the video's light-mode preview. */
  thumbnailSrc?: string;
};

export const INDUSTRIES_DATA: TIndustry[] = [
  {
    id: "hospitality",
    icon: "hospitality",
    name: "Hospitality",
    headline: "Hospitality marketing that understands the room.",
    description:
      "Restaurants and hospitality brands grow when experience, menu, atmosphere, events, and local market all work together. We help connect the moments to revenue.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    work: [
      "Restaurant content",
      "Chef features",
      "Wine dinner campaigns",
      "Reservations strategy",
      "Influencer coordination",
      "Event promotion",
    ],
    href: "/industries#hospitality",
  },
  {
    id: "real-estate",
    icon: "real-estate",
    name: "Real Estate",
    headline: "Real estate marketing needs more than beautiful renders.",
    description:
      "Developments, luxury properties, and commercial spaces need to be positioned correctly before they are promoted. We turn projects into clear, credible campaigns.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    work: [
      "Project positioning",
      "Sales decks",
      "Property films",
      "Broker-facing assets",
      "Lead generation",
      "CRM and follow-up",
    ],
    href: "/industries#real-estate",
  },
  {
    id: "aviation",
    icon: "aviation",
    name: "Aviation",
    headline: "High-trust marketing for high-value decisions.",
    description:
      "Private aviation is relationship-driven and credibility-dependent. We build positioning, content, funnels, and systems to support serious conversations.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80",
    work: [
      "Founder content",
      "Charter campaigns",
      "Landing pages",
      "Lead funnels",
      "Qualification forms",
      "CRM systems",
    ],
    href: "/industries#aviation",
  },
  {
    id: "professional-services",
    icon: "professional-services",
    name: "Professional Services",
    headline: "Make expertise easier to understand.",
    description:
      "Professional service businesses often have real value but unclear communication. We translate expertise into a clearer message and stronger acquisition.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    work: [
      "Personal brand strategy",
      "Service positioning",
      "Educational content",
      "Lead funnels",
      "CRM setup",
      "Paid campaigns",
    ],
    href: "/industries#professional-services",
  },
];
