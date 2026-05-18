export type TContactCardKey = "email" | "whatsapp" | "work" | "explore";

export type TContactCard = {
  id: TContactCardKey;
  title: string;
  value: string;
  href: string;
};

export type TContactPageData = {
  header: { title: string; description: string };
  contact_cards: TContactCard[];
  booking: {
    label: string;
    title: string;
    description: string;
  };
  map: {
    label: string;
    title: string;
    description: string;
    address: string;
    embed_src: string;
  };
};

import { SITE } from "@/config/site";

export const CONTACT_PAGE_DATA: TContactPageData = {
  header: {
    title: "Let's talk about what you're building.",
    description:
      "Tell us where the business is now, where you want it to go, and what's standing in the way. If it's a fit, we'll schedule a conversation.",
  },
  contact_cards: [
    {
      id: "email",
      title: "Email Us",
      value: SITE.contact.email,
      href: `mailto:${SITE.contact.email}`,
    },
    {
      id: "whatsapp",
      title: "WhatsApp Us",
      value: SITE.contact.whatsapp[0],
      href: `https://wa.me/${SITE.contact.whatsapp[0].replace(/[^0-9]/g, "")}`,
    },
    {
      id: "work",
      title: "Work with Us",
      value: "Explore current opportunities",
      href: "/careers",
    },
    {
      id: "explore",
      title: "Explore Us",
      value: "Learn about our services",
      href: "/about",
    },
  ],
  booking: {
    label: "Schedule a Call",
    title: "Pick a time that works for you.",
    description:
      "Skip the form and book a 30-minute call directly. We'll talk through where the business is, what you're trying to move, and whether the project is a fit.",
  },
  map: {
    label: "Visit / Mail Us",
    title: "Based in New York.",
    description:
      "We work with operators across hospitality, real estate, aviation, and professional services — based in New York with reach across the US.",
    address: SITE.contact.address,
    embed_src: SITE.contact.map_embed,
  },
};
