export interface IPodcastSlide {
  video_url: string;
  image_url: string;
}

export type TPodcastSliderData = {
  label: string;
  title: string;
  description: string;
  slides: IPodcastSlide[];
};

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/**
 * Variable name preserved for legacy imports. Content adapted to Twelve Creative —
 * brand visual showcase across hospitality, real estate, and aviation work.
 */
export const PODCAST_SLIDER_DATA: TPodcastSliderData = {
  label: "Visual Showcase",
  title: "Brand work built around the business.",
  description:
    "Frames from recent hospitality, real estate, and aviation campaigns — content shot, edited, and distributed by Twelve Creative.",
  slides: [
    {
      video_url: SAMPLE_VIDEO,
      image_url:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=768&h=512&fit=crop",
    },
    {
      video_url: SAMPLE_VIDEO,
      image_url:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=768&h=512&fit=crop",
    },
    {
      video_url: SAMPLE_VIDEO,
      image_url:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=768&h=512&fit=crop",
    },
    {
      video_url: SAMPLE_VIDEO,
      image_url:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=768&h=512&fit=crop",
    },
  ],
};
