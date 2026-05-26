export type TFeaturedAspect = "video" | "reel";

export type TFeaturedProject = {
  id: string;
  title: string;
  thumbnail_src: string;
  video_src: string;
};

export type TFeaturedCategory = {
  id: string;
  label: string;
  aspect: TFeaturedAspect;
  projects: TFeaturedProject[];
};

/**
 * Placeholder thumbnails use Unsplash; video uses Big Buck Bunny.
 * Replace `thumbnail_src` and `video_src` with real Twelve Creative content per project.
 */
const PLACEHOLDER_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const FEATURED_CATEGORIES: TFeaturedCategory[] = [
  {
    id: "hospitality",
    label: "Hospitality",
    aspect: "video",
    projects: [
      {
        id: "h-1",
        title: "Chef Spotlight — Wine Dinner Series",
        thumbnail_src:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "h-2",
        title: "Rooftop Opening — Hudson Hospitality",
        thumbnail_src:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "h-3",
        title: "Menu Launch — Casa del Mar",
        thumbnail_src:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
    ],
  },
  {
    id: "real-estate",
    label: "Real Estate",
    aspect: "video",
    projects: [
      {
        id: "re-1",
        title: "Meridian Tower — Sales Film",
        thumbnail_src:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "re-2",
        title: "Atlas Developments — Project Reveal",
        thumbnail_src:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "re-3",
        title: "Obsidian — Luxury Property Tour",
        thumbnail_src:
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
    ],
  },
  {
    id: "aviation",
    label: "Aviation",
    aspect: "video",
    projects: [
      {
        id: "av-1",
        title: "Velocity Aviation — Charter Film",
        thumbnail_src:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "av-2",
        title: "Skyline Charter — Founder Story",
        thumbnail_src:
          "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "av-3",
        title: "Northstar — Operations Behind the Scenes",
        thumbnail_src:
          "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
    ],
  },
  {
    id: "professional-services",
    label: "Professional Services",
    aspect: "video",
    projects: [
      {
        id: "ps-1",
        title: "Founder Talk — Brightline Advisors",
        thumbnail_src:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "ps-2",
        title: "Operator Interview — Forge Advisors",
        thumbnail_src:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
      {
        id: "ps-3",
        title: "Monarch Consulting — Expertise on Camera",
        thumbnail_src:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=675&fit=crop&auto=format",
        video_src: PLACEHOLDER_VIDEO,
      },
    ],
  },
];
