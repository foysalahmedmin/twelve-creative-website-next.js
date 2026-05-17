export type TProcessIconKey =
  | "understand"
  | "position"
  | "build"
  | "launch"
  | "install"
  | "improve";

export type TProcessStep = {
  id: string;
  index: string;
  icon: TProcessIconKey;
  title: string;
  description: string;
};

export const PROCESS_DATA: TProcessStep[] = [
  {
    id: "step-1",
    index: "01",
    icon: "understand",
    title: "Understand the business",
    description:
      "We review the offer, audience, market, existing materials, sales process, and current bottlenecks.",
  },
  {
    id: "step-2",
    index: "02",
    icon: "position",
    title: "Clarify the position",
    description:
      "We define what the business needs to communicate and what the market needs to believe before taking action.",
  },
  {
    id: "step-3",
    index: "03",
    icon: "build",
    title: "Build the creative",
    description:
      "We create the assets needed to make the business visible, credible, and compelling.",
  },
  {
    id: "step-4",
    index: "04",
    icon: "launch",
    title: "Launch distribution",
    description:
      "We place the message in front of the right people through social, ads, email, SMS, PR, and other channels.",
  },
  {
    id: "step-5",
    index: "05",
    icon: "install",
    title: "Install the system",
    description:
      "We connect the backend: landing pages, CRM, automations, tracking, and follow-up.",
  },
  {
    id: "step-6",
    index: "06",
    icon: "improve",
    title: "Improve based on reality",
    description:
      "We review what is working, where people are dropping off, and what needs to be refined.",
  },
];
