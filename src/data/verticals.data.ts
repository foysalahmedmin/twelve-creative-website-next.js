export type TVertical = {
  id: string;
  title: string;
  description: string;
  tagline: string;
  body: string;
  image: string;
  video?: string;
  href: string;
  accent: string;
};

export const VERTICALS_DATA: TVertical[] = [
  {
    id: "real-estate",
    title: "Real Estate",
    description: "Developments driven by demand, leads, and full sellout.",
    tagline: "From listing to sellout.",
    body: "We build the marketing infrastructure that moves real estate — from pre-launch positioning and creative campaigns to lead systems and conversion flows that fill pipelines and close deals.",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
    video: "",
    href: "/verticals/real-estate",
    accent: "#c8a96e",
  },
  {
    id: "hospitality",
    title: "Hospitality",
    description: "Restaurants and venues fueled by reservations and private events.",
    tagline: "Seats filled. Tables turned.",
    body: "From food and beverage brands to boutique hotels and private event venues, we build the content, campaigns, and systems that keep your seats full and your private events calendar booked.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
    video: "",
    href: "/verticals/hospitality",
    accent: "#e07b54",
  },
  {
    id: "ventures",
    title: "Ventures",
    description: "Selected businesses with shared upside.",
    tagline: "Built for growth.",
    body: "We partner with a select group of businesses where we have genuine conviction in the model — contributing strategy, creative, and systems in exchange for shared upside rather than flat fees.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
    video: "",
    href: "/verticals/ventures",
    accent: "#4a7c9e",
  },
  {
    id: "about-us",
    title: "About Us",
    description: "Strategy, creative, and systems built around the way each business grows.",
    tagline: "The structure behind growth.",
    body: "Twelve Creative was built from the belief that creative work should be connected to the business it serves. We close the gap between strategy and execution for businesses that need both in the same room.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80",
    video: "",
    href: "/about",
    accent: "#6b7280",
  },
];
