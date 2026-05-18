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
  image: string;
};

export type TProcessData = {
  label: string;
  title: string;
  description: string;
  image: string;
  process_steps: TProcessStep[];
};

export const PROCESS_STEPS: TProcessStep[] = [
  {
    id: "step-1",
    index: "01",
    icon: "understand",
    title: "Understand the business",
    description:
      "We review the offer, audience, market, existing materials, sales process, and current bottlenecks.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=898&fit=crop&auto=format",
  },
  {
    id: "step-2",
    index: "02",
    icon: "position",
    title: "Clarify the position",
    description:
      "We define what the business needs to communicate and what the market needs to believe before taking action.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=768&h=898&fit=crop&auto=format",
  },
  {
    id: "step-3",
    index: "03",
    icon: "build",
    title: "Build the creative",
    description:
      "We create the assets needed to make the business visible, credible, and compelling.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=768&h=898&fit=crop&auto=format",
  },
  {
    id: "step-4",
    index: "04",
    icon: "launch",
    title: "Launch distribution",
    description:
      "We place the message in front of the right people through social, ads, email, SMS, PR, and other channels.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=768&h=898&fit=crop&auto=format",
  },
  {
    id: "step-5",
    index: "05",
    icon: "install",
    title: "Install the system",
    description:
      "We connect the backend: landing pages, CRM, automations, tracking, and follow-up.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=768&h=898&fit=crop&auto=format",
  },
  {
    id: "step-6",
    index: "06",
    icon: "improve",
    title: "Improve based on reality",
    description:
      "We review what is working, where people are dropping off, and what needs to be refined.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=768&h=898&fit=crop&auto=format",
  },
];

export const PROCESS_DATA: TProcessData = {
  label: "Our Process",
  title: "How We Work",
  description:
    "We follow a clear, repeatable process to ensure every project is delivered on time and to the highest standard.",
  image:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=898&fit=crop&auto=format",
  process_steps: PROCESS_STEPS,
};
