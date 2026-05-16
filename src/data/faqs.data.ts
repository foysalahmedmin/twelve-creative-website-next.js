export type TFaq = {
  id: string;
  question: string;
  answer: string | string[];
  type: "text" | "list";
};

export const FAQS_DATA: TFaq[] = [
  {
    id: "1",
    question: "What does Twelve Creative actually do?",
    type: "text",
    answer:
      "Twelve Creative builds the marketing structure behind business growth. We work across positioning, creative production, distribution, websites, CRM, and automation — connecting these pieces so the business has a clearer path from attention to revenue.",
  },
  {
    id: "2",
    question: "How is Twelve Creative different from a typical marketing agency?",
    type: "text",
    answer:
      "Most agencies focus on one thing — content, ads, websites, or strategy. Twelve Creative builds these pieces together. We look at the full path: how the business is positioned, how it is presented, how people discover it, and what happens after they show interest. The goal is a system, not just an activity.",
  },
  {
    id: "3",
    question: "What types of businesses do you work with?",
    type: "list",
    answer: [
      "Restaurant groups and hospitality brands",
      "Real estate developers and luxury property companies",
      "Private aviation and charter businesses",
      "Professional service firms",
      "Founders building personal brands connected to real offers",
      "Companies without a full internal marketing department",
    ],
  },
  {
    id: "4",
    question: "What does the process look like?",
    type: "list",
    answer: [
      "Understand the business — review the offer, audience, and current bottlenecks",
      "Clarify the position — define what the business needs to communicate",
      "Build the creative — create assets that make the business visible and credible",
      "Launch distribution — reach the right people through the right channels",
      "Install the system — connect landing pages, CRM, automations, and tracking",
      "Improve based on reality — review, refine, and optimize over time",
    ],
  },
  {
    id: "5",
    question: "How do we get started?",
    type: "text",
    answer:
      "Start by submitting an inquiry through the contact page. Tell us what you are building, where the business is now, and what needs to move. If the project is aligned, we will reach out to schedule a conversation.",
  },
  {
    id: "6",
    question: "Do you work on a project basis or retainer?",
    type: "text",
    answer:
      "Both. We offer defined project buildouts (System Install) for businesses that need a specific deliverable, and ongoing growth partnerships for companies that want embedded strategic and creative support over time.",
  },
  {
    id: "7",
    question: "Do you show pricing on the website?",
    type: "text",
    answer:
      "No. Every business is different. The scope, timeline, and investment depend on what needs to be built. The best first step is a conversation.",
  },
  {
    id: "8",
    question: "What industries do you have the most experience in?",
    type: "list",
    answer: [
      "Hospitality — restaurants, lounges, rooftops, chefs, and hospitality groups",
      "Real Estate — developers, luxury properties, commercial spaces",
      "Aviation — private aviation brands and charter professionals",
      "Professional Services — firms that depend on trust and referrals",
    ],
  },
];
