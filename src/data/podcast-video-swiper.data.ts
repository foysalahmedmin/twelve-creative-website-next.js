export interface IVideoItem {
  id: number;
  url: string;
  thumbnail: string;
  title: string;
}

export type TPodcastVideoData = {
  label: string;
  title: string;
  description: string;
  videos: IVideoItem[];
};

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/**
 * Variable name preserved for legacy imports. Content adapted to Twelve Creative —
 * featured production carousel across hospitality, real estate, aviation, and
 * professional service work.
 */
export const PODCAST_VIDEO_DATA: TPodcastVideoData = {
  label: "Featured Productions",
  title: "Work that earned attention and conversation.",
  description:
    "A short selection of recent productions — brand films, founder content, and campaign assets built for businesses moving the metric.",
  videos: [
    {
      id: 1,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=768&h=432&fit=crop&auto=format",
      title: "Hudson Hospitality — Opening Night",
    },
    {
      id: 2,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=768&h=432&fit=crop&auto=format",
      title: "Meridian Properties — Project Reveal",
    },
    {
      id: 3,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=768&h=432&fit=crop&auto=format",
      title: "Skyline Charter — Founder Film",
    },
    {
      id: 4,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=768&h=432&fit=crop&auto=format",
      title: "Casa del Mar — Menu Launch",
    },
    {
      id: 5,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=768&h=432&fit=crop&auto=format",
      title: "Brightline Advisors — Founder Series",
    },
    {
      id: 6,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=768&h=432&fit=crop&auto=format",
      title: "Velocity Aviation — Charter Campaign",
    },
    {
      id: 7,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=768&h=432&fit=crop&auto=format",
      title: "Atlas Developments — Sales Film",
    },
    {
      id: 8,
      url: SAMPLE_VIDEO,
      thumbnail:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=768&h=432&fit=crop&auto=format",
      title: "Vesta Group — Chef Spotlight",
    },
  ],
};
