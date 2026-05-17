export type THomeCta = {
  eyebrow: string;
  title: string;
  description: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string };
};

export const HOME_CTA_DATA: THomeCta = {
  eyebrow: "Let's build it",
  title: "Need more than marketing activity?",
  description:
    "If your business needs clearer positioning, stronger creative, better distribution, and a system that supports real follow-up — Twelve Creative can help build the structure.",
  primary_cta: { label: "Start a Conversation", href: "/contact" },
  secondary_cta: { label: "See the Process", href: "/process" },
};
