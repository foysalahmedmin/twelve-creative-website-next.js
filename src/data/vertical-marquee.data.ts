export interface IMarqueeItem {
  image_url: string;
  video_url: string;
  alt?: string;
}

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const CANVAS_MARQUEE_DATA: IMarqueeItem[] = [
  {
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=512&h=912&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Hospitality brand film — restaurant interior",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=512&h=912&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Real estate project reveal — luxury residential",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=512&h=912&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Aviation charter — founder film",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=512&h=912&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Restaurant menu launch — campaign asset",
  },
];
