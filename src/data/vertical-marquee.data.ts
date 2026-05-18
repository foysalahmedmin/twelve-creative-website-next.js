export interface IMarqueeItem {
  image_url: string;
  video_url: string;
  alt?: string;
}

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

/**
 * Vertical marquee assets representing Twelve Creative's work across industries.
 * Replace image and video URLs with real client work as it becomes available.
 */
export const CANVAS_MARQUEE_DATA: IMarqueeItem[] = [
  {
    image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=512&h=768&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Hospitality brand film — restaurant interior",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=512&h=768&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Real estate project reveal — luxury residential",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=512&h=768&fit=crop&auto=format",
    video_url: "",
    alt: "Website and landing page architecture",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=512&h=768&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Aviation charter — founder film",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=512&h=768&fit=crop&auto=format",
    video_url: "",
    alt: "Professional services — founder interview",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=512&h=768&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "Restaurant menu launch — campaign asset",
  },
  {
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=512&h=768&fit=crop&auto=format",
    video_url: SAMPLE_VIDEO,
    alt: "CRM and automation dashboard",
  },
];
