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

export const PODCAST_SLIDER_DATA: TPodcastSliderData = {
  label: "Visual Assets",
  title: "Premium Show Packaging Slides",
  description: "Explore some of our beautiful cover art, social cards, and branding templates.",
  slides: [
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", image_url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=768&h=512&fit=crop" },
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", image_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=768&h=512&fit=crop" },
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", image_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=512&fit=crop" },
    { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=512&fit=crop" },
  ],
};
