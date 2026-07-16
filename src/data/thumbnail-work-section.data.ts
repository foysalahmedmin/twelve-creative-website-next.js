export interface IPortfolioItem {
  id?: string;
  thumbnail: string;
  video_link?: string | null;
  title?: string;
  aspect?: "reel" | "landscape";
}

export type TPortfolioData = {
  label: string;
  title: string;
  description: string;
  type: "standard" | "shortsreels-editing";
  work: IPortfolioItem[];
};

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const CANVAS_PORTFOLIO_DATA: TPortfolioData = {
  label: "Work Showcase",
  title: "Work built around business context.",
  description:
    "Our work is measured by whether the business becomes clearer, more credible, and better equipped to convert attention into action.",
  type: "standard" as "standard" | "shortsreels-editing",
  work: [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=768&h=552&fit=crop&auto=format",
      video_link: SAMPLE_VIDEO,
      title: "Hudson Hospitality — Brand Film",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=768&h=552&fit=crop&auto=format",
      video_link: SAMPLE_VIDEO,
      title: "Meridian Properties — Project Reveal",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=768&h=552&fit=crop&auto=format",
      video_link: SAMPLE_VIDEO,
      title: "Skyline Charter — Founder Film",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=768&h=552&fit=crop&auto=format",
      video_link: null,
      title: "Casa del Mar — Menu Launch",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=768&h=552&fit=crop&auto=format",
      video_link: SAMPLE_VIDEO,
      title: "Brightline Advisors — Founder Series",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=768&h=552&fit=crop&auto=format",
      video_link: null,
      title: "Velocity Aviation — Charter Campaign",
    },
  ] as IPortfolioItem[],
};
