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

export const PODCAST_VIDEO_DATA: TPodcastVideoData = {
  label: "Showcase Reel",
  title: "Featured Production Carousel",
  description: "Slide through and click to watch our high-yield promotional content productions.",
  videos: [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=432&fit=crop&auto=format",
    title: "Cinematic Commercial Pitch Film",
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=432&fit=crop&auto=format",
    title: "High-Growth Software Explainer",
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=432&fit=crop&auto=format",
    title: "Omnichannel Founder Direct-to-Camera",
  },
  {
    id: 4,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=768&h=432&fit=crop&auto=format",
    title: "Documentary Highlight Reel",
  },
  {
    id: 5,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=768&h=432&fit=crop&auto=format",
    title: "Product Launch Teaser",
  },
  {
    id: 6,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=768&h=432&fit=crop&auto=format",
    title: "Client Testimonial Mini-doc",
  },
  {
    id: 7,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=768&h=432&fit=crop&auto=format",
    title: "Social Media Micro-Content Strategy",
  },
  {
    id: 8,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=768&h=432&fit=crop&auto=format",
    title: "Event Coverage Highlights",
  }
  ],
};
