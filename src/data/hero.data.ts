export type THero = {
  trust_label: string;
  trust_avatars: { id: string; label: string; icon: string }[];
  title: string;
  description: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string };
  video: { src: string; poster?: string };
};

export const HERO_DATA: THero = {
  trust_label: "Trusted across industries",
  trust_avatars: [
    { id: "real-estate", label: "Real Estate", icon: "building" },
    { id: "hospitality", label: "Hospitality", icon: "restaurant" },
    { id: "ventures", label: "Ventures", icon: "airplane" },
    { id: "professional", label: "Professional", icon: "briefcase" },
  ],
  title: "We Build The Structure Behind Growth",
  description:
    "Twelve Creative helps businesses clarify their positioning, create stronger content, distribute it with purpose, and install the systems that turn attention into revenue.",
  primary_cta: { label: "Start a Conversation", href: "/contact" },
  secondary_cta: { label: "View Our Work", href: "/works" },
  video: {
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
};
