export type TFaqItem = {
  question: string;
  answer: string;
};

export type TFaqsData = {
  image: string;
  alt: string;
  title: string;
  description: string;
  name: string;
  position: string;
  contact_link: string;
  faqs: TFaqItem[];
};

export const FAQS_DATA: TFaqsData = {
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&auto=format",
  alt: "Safwan Wafif - Project Coordinator",
  title: "Have more questions?",
  description:
    "Still curious? Let’s talk it out. Book a quick call. We’ll walk you through everything and help you figure out the best move for your brand.",
  name: "Safwan Wafif",
  position: "Project Co-ordinator",
  contact_link: "https://calendly.com/imonofficial2/30min",
  faqs: [
    {
      question: "Do you optimize for different platforms?",
      answer:
        "Yes. We cut each feed: hooks fast, captions clean, pacing tuned, and the right crop. You get platform-ready exports, thumbnails, SRTs, and titles.",
    },
    {
      question: "What do I need to send you?",
      answer:
        "Raw footage, brand kit, logos, scripts or talking points, your goal, and any refs you like. Share via Drive or Dropbox. If unsure, send it. We will be short.",
    },
    {
      question: "Can you turn one long video into lots of short clips?",
      answer:
        "Yes. We mine one recording for 8-12 strong hooks, cut clean clips, add captions and roll, then export 9:16, 1:1, 16:9 so you can post across channels.",
    },
    {
      question: "How many revision rounds do I get?",
      answer:
        "Two rounds per edit. Most wrap in one. Leave time-stamped notes, and we turn them fast. Need extra versions or a new direction? We will confirm the scope first.",
    },
  ],
};
