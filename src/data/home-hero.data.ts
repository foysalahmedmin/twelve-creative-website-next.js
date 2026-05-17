export type THomeHero = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string };
  trust_label: string;
  trust_industries: { id: string; name: string }[];
};

export const HOME_HERO_DATA: THomeHero = {
  eyebrow: "Growth Systems Studio",
  title: "We build the structure behind",
  highlight: "growth.",
  description:
    "Twelve Creative helps businesses clarify their positioning, create stronger content, distribute it with purpose, and install the systems that turn attention into revenue.",
  primary_cta: { label: "Start a Conversation", href: "/contact" },
  secondary_cta: { label: "View Our Work", href: "/work" },
  trust_label: "Trusted across",
  trust_industries: [
    { id: "hospitality", name: "Hospitality" },
    { id: "real-estate", name: "Real Estate" },
    { id: "aviation", name: "Aviation" },
    { id: "professional-services", name: "Professional Services" },
  ],
};
