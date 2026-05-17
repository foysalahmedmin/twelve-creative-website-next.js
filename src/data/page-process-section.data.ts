export interface IProcessStep {
  icon: string;
  alt: string;
  title: string;
  description: string;
  image: string;
}

export const CANVAS_PROCESS_DATA = {
  tag: "Our Process",
  heading_part1: "How We Turn Attention",
  heading_part2: "Into Measurable Revenue",
  paragraph: "A transparent, structured system engineered to eliminate back-and-forth communication bottlenecks.",
  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=898&fit=crop&auto=format",
  process_steps: [
    {
      icon: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=64&h=64&fit=crop&auto=format",
      alt: "phase-1",
      title: "1. Brand Strategy Blueprint",
      description: "We audit your current positioning and sketch out the full creative concept, hook style, and system schema.",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=768&h=898&fit=crop&auto=format",
    },
    {
      icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=64&h=64&fit=crop&auto=format",
      alt: "phase-2",
      title: "2. Cinematic Asset Production",
      description: "Our world-class editing, copywriting, and development teams bring the high-end custom visual creative to life.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=768&h=898&fit=crop&auto=format",
    },
    {
      icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop&auto=format",
      alt: "phase-3",
      title: "3. Systems Integration & Launch",
      description: "We plug all assets into high-performance landing pages, connect CRM lead pipelines, and launch marketing funnels.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=768&h=898&fit=crop&auto=format",
    },
    {
      icon: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=64&h=64&fit=crop&auto=format",
      alt: "phase-4",
      title: "4. Iteration and Scaling",
      description: "We monitor data actively. Adjusting hooks, re-targeting lost leads, and optimizing copy based on concrete user actions.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=768&h=898&fit=crop&auto=format",
    },
  ] as IProcessStep[],
};
