import { ENV } from "./env";

export const SITE = {
  name: "Twelve Creative",
  domain: "twelvecreative.io",
  website: "https://twelvecreative.io",
  description:
    "Twelve Creative builds the structure behind business growth — connecting positioning, cinematic creative, distribution, and conversion systems into one working process.",
  tagline: "We build the structure behind growth.",
  url: ENV.NEXT_PUBLIC_APP_URL || "https://twelvecreative.io",
  ogImage: "/og-image.jpg",
  founder: {
    name: "Carlos Doce",
    title: "Founder, Twelve Creative",
    bio: "Carlos Doce is the founder of Twelve Creative. With more than 15 years in video production and a background in film and business from NYU, Carlos built Twelve Creative to combine cinematic creative with the practical systems businesses need to grow.",
  },
  links: {
    facebook: "https://www.facebook.com/twelvecreative",
    twitter: "#",
    linkedin: "#",
    instagram: "https://www.instagram.com/twelvecreative",
    youtube: "#",
  },
  contact: {
    email: "hello@twelvecreative.io",
    phones: ["+1 (000) 000-0000"],
    address: "New York, NY",
    whatsapp: ["+1 (951) 822-6223"],
    map_embed:
      "https://maps.google.com/maps?q=New+York,+NY&t=&z=12&ie=UTF8&iwloc=&output=embed",
  },
  nav: [
    { name: "Home", href: "/" },
    { name: "What We Build", href: "/what-we-build" },
    { name: "Industries", href: "/industries" },
    { name: "Works", href: "/works" },
    { name: "Process", href: "/process" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  keywords: [
    "Twelve Creative",
    "Growth Systems",
    "Marketing Strategy",
    "Creative Agency",
    "Brand Positioning",
    "Video Production",
    "CRM Automation",
    "Conversion Systems",
    "Hospitality Marketing",
    "Real Estate Marketing",
    "Aviation Marketing",
  ],
};
