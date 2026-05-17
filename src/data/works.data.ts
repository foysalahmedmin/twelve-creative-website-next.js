export interface IMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface IWorkItem {
  id: string;
  type: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  created_at: string;
  metrics: IMetric[];

  // Case Study Details fields
  tag_slugs: string[];
  hero_stats: { label: string; value: string }[];
  client?: {
    name: string;
    industry: string;
    domain: string;
    employees: string;
    tags: string[];
    desc: string;
    logo: string;
  };
  situation_intro?: string;
  challenge_intro?: string;
  challenge_items?: { title: string; desc: string }[];
  solution_intro?: string;
  solution_phases?: { phase: string; time?: string; desc: string }[];
  outcome_desc?: string;
  outcome_video?: string;
  testimonial?: {
    quote: string;
    avatar_url?: string;
    name: string;
    role: string;
  };
  calendly_url?: string;
}

export const WORKS_PAGE_MOCK_DATA: IWorkItem[] = [
  {
    id: "1",
    type: "Growth System",
    title: "How SparkLabs Scaled ARR by 3× in 9 Months",
    description: "SparkLabs came to us with a fragmented marketing strategy. We installed our full-stack CRM integration, developed 12 cinematic short-form video hooks, and built a custom SaaS explainer landing page that completely restructured their outbound pipeline.",
    image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&h=720&fit=crop&auto=format",
    image_alt: "SparkLabs Dashboard Strategy",
    created_at: "2024-03-15T12:00:00Z",
    metrics: [
      { label: "ARR Growth", value: "3×", sub: "Annual run rate" },
      { label: "Timeline", value: "9 mo", sub: "Execution duration" },
      { label: "Final ARR", value: "$2.4M", sub: "Total revenue" },
      { label: "CAC", value: "-45%", sub: "Customer acquisition cost" },
    ],
    tag_slugs: ["B2B SaaS", "CRM Build", "Cinematic Shorts"],
    hero_stats: [
      { label: "ARR Growth", value: "3×" },
      { label: "Cost Per Lead", value: "-45%" },
    ],
    client: {
      name: "SparkLabs",
      industry: "Software",
      domain: "sparklabs.ai",
      employees: "50-200",
      tags: ["B2B", "SaaS", "Enterprise"],
      desc: "SparkLabs is an enterprise data analytics platform helping mid-market businesses visualize complex supply chain structures.",
      logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop&auto=format",
    },
    situation_intro: "Before partnering with Twelve Creative, SparkLabs relied heavily on outbound cold calling with very little inbound marketing structure. Their sales cycles were long (90+ days), and prospects had trouble understanding the core software offering through their text-heavy website.",
    challenge_intro: "The primary challenge was simplifying complex enterprise software into digestible, high-converting video assets and creating an automated distribution pipeline.",
    challenge_items: [
      { title: "Low Conversion Rates", desc: "The existing landing page converted traffic at less than 0.8%." },
      { title: "No Visual Proof", desc: "Sales teams lacked high-end product explainer videos to send after discovery calls." },
      { title: "Fragmented Data", desc: "Marketing data wasn't effectively syncing into the CRM for automated follow-ups." },
    ],
    solution_intro: "We completely overhauled their external facing brand and hooked it directly into an automated sales engine.",
    solution_phases: [
      { phase: "Brand Strategy Audit", time: "Weeks 1-2", desc: "We defined a clear market positioning statement and mapped out the exact buyer journey." },
      { phase: "Cinematic Video Production", time: "Weeks 3-5", desc: "Shot and edited a suite of 12 short-form videos and 1 master explainer film." },
      { phase: "System Implementation", time: "Weeks 6-8", desc: "Launched a new Webflow site natively integrated with HubSpot and automated email flows." },
      { phase: "Iterative Scaling", time: "Month 3+", desc: "Began deploying paid media assets, continuously a/b testing hooks to drop CAC." },
    ],
    outcome_desc: "Within 9 months of system deployment, SparkLabs saw their inbound lead volume triple and their sales cycle shorten by 40%. The cinematic explainer video became their highest-performing asset in paid channels.",
    outcome_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    testimonial: {
      quote: "Twelve Creative didn't just give us a new website or a few videos. They built an entire growth machine that fundamentally changed how we acquire customers.",
      name: "Johnathan Mercer",
      role: "CEO, SparkLabs",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format",
    },
    calendly_url: "https://calendly.com/twelve-creative",
  },
  {
    id: "2",
    type: "Cinematic Branding",
    title: "Empire Creative: Dominating the Agency Market",
    description: "To stand out in a saturated market, Empire needed more than a new logo. We architected a complete brand positioning guideline, shot a high-end commercial documentary, and rolled out a responsive direct-to-consumer website overhaul.",
    image_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1280&h=720&fit=crop&auto=format",
    image_alt: "Empire Rebrand Process",
    created_at: "2024-02-22T08:30:00Z",
    metrics: [
      { label: "Bookings", value: "+145%", sub: "Qualified calls" },
      { label: "Cost Per Lead", value: "-40%", sub: "Ad spend efficiency" },
      { label: "Timeline", value: "4 mo", sub: "Execution phase" },
      { label: "Retention", value: "98%", sub: "Client longevity" },
    ],
    tag_slugs: ["Agency Rebrand", "Commercial Documentary"],
    hero_stats: [
      { label: "Qualified Calls", value: "+145%" },
      { label: "Ad Efficiency", value: "-40% CPL" },
    ],
    client: {
      name: "Empire Creative",
      industry: "Marketing Agency",
      domain: "empire.agency",
      employees: "20-50",
      tags: ["Agency", "B2B", "Consulting"],
      desc: "Empire Creative is a boutique design and performance agency that was struggling to articulate their premium value proposition.",
      logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=128&h=128&fit=crop&auto=format",
    },
    situation_intro: "Empire was charging premium prices but had a web presence that looked like a cheap freelancer portfolio. This created a massive dissonance for prospects coming off highly polished sales calls.",
    challenge_intro: "They needed to visually demonstrate their authority and back up their high-ticket pricing with an undeniable aesthetic.",
    challenge_items: [
      { title: "Brand Dissonance", desc: "The external branding did not match the internal delivery quality." },
      { title: "Lack of Trust Assets", desc: "They had great case studies but no cinematic way to present them." },
    ],
    solution_intro: "We positioned them as the undeniable premium choice in their sector through a full visual and operational rebrand.",
    solution_phases: [
      { phase: "Identity Design", time: "Month 1", desc: "Developed a sleek, typography-first visual identity (no drop shadows, flat elegant layouts)." },
      { phase: "Documentary Build", time: "Month 2", desc: "Filmed a 5-minute brand documentary interviewing their top clients and showcasing their office culture." },
      { phase: "Web Deployment", time: "Month 3-4", desc: "Built a fully custom, GSAP-animated web experience that wowed prospects instantly." },
    ],
    outcome_desc: "Empire immediately raised their prices by 30% without seeing a drop in close rates. The brand documentary now serves as their primary outbound anchor asset.",
    outcome_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    testimonial: {
      quote: "The visual authority they built for us makes the sales process almost effortless. People show up to the call already sold on our credibility.",
      name: "Marcus Aurelius",
      role: "Founding Partner, Empire Creative",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format",
    },
    calendly_url: "https://calendly.com/twelve-creative",
  },
  {
    id: "3",
    type: "Automation Pipeline",
    title: "NovaTech's Seamless E-Commerce Integration",
    description: "We completely stripped out NovaTech's manual follow-up sequences. By connecting a dynamic custom headless commerce frontend directly to their backend workflows, we captured lost abandoned carts automatically.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop&auto=format",
    image_alt: "NovaTech Funnel System",
    created_at: "2023-11-05T14:45:00Z",
    metrics: [
      { label: "Recovery Rate", value: "28%", sub: "Abandoned carts" },
      { label: "Automation", value: "100%", sub: "Follow-up sequences" },
      { label: "ROAS", value: "4.2×", sub: "Ad spend return" },
      { label: "Revenue", value: "+$400k", sub: "Added MMR" },
    ],
    tag_slugs: ["E-Commerce", "Headless Build", "CRM Automation"],
    hero_stats: [
      { label: "Cart Recovery", value: "28%" },
      { label: "Added Revenue", value: "+$400k" },
    ],
    client: {
      name: "NovaTech",
      industry: "Consumer Electronics",
      domain: "novatech.io",
      employees: "200-500",
      tags: ["DTC", "E-Commerce", "Tech"],
      desc: "NovaTech builds high-end consumer hardware for remote workers, including modular desk systems and lighting.",
      logo: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=128&h=128&fit=crop&auto=format",
    },
    situation_intro: "NovaTech had a great product but an incredibly leaky bucket. They were driving thousands of visitors per day through expensive paid media, but their cart abandonment rate was staggering and they had zero automated follow-up.",
    challenge_intro: "We needed to stop the revenue leak by installing a proper automation infrastructure while simultaneously elevating the product's perceived value.",
    challenge_items: [
      { title: "Abandoned Carts", desc: "Over 70% of carts were abandoned with no recovery system in place." },
      { title: "Slow Frontend", desc: "Their legacy Shopify template was bloated, causing 4-second load times." },
      { title: "Poor Video Content", desc: "Product videos were shot on iPhones by the founders, lacking professional polish." },
    ],
    solution_intro: "A three-pronged attack: Speed up the site, automate the retention, and shoot high-end 3D product visuals.",
    solution_phases: [
      { phase: "Headless Rebuild", time: "Weeks 1-4", desc: "Migrated them to a Next.js headless storefront utilizing Shopify's Storefront API for blazing fast 300ms load times." },
      { phase: "CRM Flow Architecture", time: "Weeks 5-6", desc: "Installed comprehensive Klaviyo flows for browse abandonment, cart abandonment, and post-purchase upsells." },
      { phase: "3D Visual Production", time: "Weeks 7-10", desc: "Produced stunning 3D rendered commercials highlighting the modularity of their hardware." },
    ],
    outcome_desc: "The new headless site immediately boosted conversion rates by 1.2%, while the automated flows started recovering 28% of all abandoned carts. The new 3D creative dropped their Facebook ad CPA by half.",
    outcome_video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    testimonial: {
      quote: "The system runs fully automated behind the scenes. We're capturing revenue while we sleep now, and the site looks absolutely incredible.",
      name: "Daniel Foster",
      role: "VP Marketing, NovaTech",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&auto=format",
    },
    calendly_url: "https://calendly.com/twelve-creative",
  },
];
