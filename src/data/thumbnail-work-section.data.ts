export interface IPortfolioItem {
  id?: string;
  thumbnail: string;
  video_link?: string | null;
  title?: string;
}

export const CANVAS_PORTFOLIO_DATA = {
  tag: "Portfolio Showcase",
  heading_part1: "Works That Turn Attention Into Action",
  paragraph: "Explore some of our high-performing client campaigns, video productions, and design structures.",
  type: "standard" as "standard" | "shortsreels-editing",
  work: [
    {
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=768&h=552&fit=crop&auto=format",
      video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Commercial Film",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=768&h=552&fit=crop&auto=format",
      video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Brand Documentary",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=768&h=552&fit=crop&auto=format",
      video_link: null,
      title: "UI Design Framework",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=768&h=552&fit=crop&auto=format",
      video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Corporate Identity",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=768&h=552&fit=crop&auto=format",
      video_link: null,
      title: "E-Commerce System",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=768&h=552&fit=crop&auto=format",
      video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Web App Launch",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=768&h=552&fit=crop&auto=format",
      video_link: null,
      title: "Data Dashboard",
    },
    {
      thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=768&h=552&fit=crop&auto=format",
      video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Ad Campaign Assets",
    },
  ] as IPortfolioItem[],
};
