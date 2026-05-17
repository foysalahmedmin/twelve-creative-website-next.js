export type THomeHero = {
  trust_label: string;
  trust_avatars: { id: string; label: string; icon: string }[];
  title: string;
  description: string;
  primary_cta: { label: string; href: string };
  secondary_cta: { label: string; href: string };
  video: { src: string; poster?: string };
};

export const HOME_HERO_DATA: THomeHero = {
  trust_label: "Trusted across industries",
  trust_avatars: [
    { id: "hospitality", label: "Hospitality", icon: "restaurant" },
    { id: "real-estate", label: "Real Estate", icon: "building" },
    { id: "aviation", label: "Aviation", icon: "airplane" },
    { id: "professional", label: "Professional", icon: "briefcase" },
  ],
  title: "We Build The Structure Behind Growth",
  description:
    "Twelve Creative helps businesses clarify their positioning, create stronger content, distribute it with purpose, and install the systems that turn attention into revenue.",
  primary_cta: { label: "Start a Conversation", href: "/contact" },
  secondary_cta: { label: "View Our Work", href: "/work" },
  video: {
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
};
