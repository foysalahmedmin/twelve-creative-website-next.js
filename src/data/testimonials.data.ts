export interface TTestimonial {
  id: string;
  name: string;
  designation: string;
  image: string;
  category: "message" | "video_message";
  message?: string;
  video_message?: string;
  thumbnail?: string;
}

export type TTestimonialData = {
  label: string;
  title: string;
  description: string;
  testimonials: TTestimonial[];
};

export const TESTIMONIALS: TTestimonial[] = [
  {
    id: "1",
    name: "Ali Abdaal",
    designation: "YouTube Creator & Author (5M+ Subs)",
    image: "/assets/hero_client-1.png",
    category: "video_message",
    video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/assets/discover.png",
  },
  {
    id: "2",
    name: "Dan Koe",
    designation: "Founder, Modern Mastery & Creator",
    image: "/assets/hero_client-2.png",
    category: "video_message",
    video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/assets/location.png",
  },
  {
    id: "3",
    name: "Codie Sanchez",
    designation: "Founder, Contrarian Thinking",
    image: "/assets/hero_client-3.png",
    category: "video_message",
    video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/assets/edit.png",
  },
  {
    id: "4",
    name: "Justin Welsh",
    designation: "Solopreneur & Creator Advisor",
    image: "/assets/hero_client-4.png",
    category: "video_message",
    video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "/assets/file-video.png",
  },
  // Text testimonials
  {
    id: "t1",
    name: "Thomas Frank",
    designation: "Productivity Creator (2.5M+ Subs)",
    image: "/assets/hero_client-1.png",
    category: "message",
    message: "Twelve Creative completely restructured our editing workflow. The video pacing and retention are unmatched. Highly recommended!",
  },
  {
    id: "t2",
    name: "Ayaan Khan",
    designation: "CEO, TechNova Inc.",
    image: "/assets/hero_client-2.png",
    category: "message",
    message: "The single best investment we made for our content strategy. They connected brand distribution directly to our growth numbers.",
  },
  {
    id: "t3",
    name: "Sarah Jenkins",
    designation: "Head of Growth, Loom & Co",
    image: "/assets/hero_client-3.png",
    category: "message",
    message: "Working with this team was seamless. They took all the pressure off our internal media ops team and delivered stellar results.",
  },
  {
    id: "t4",
    name: "Marcus Aurelius",
    designation: "Founder, Stoic Media",
    image: "/assets/hero_client-4.png",
    category: "message",
    message: "Consistency is everything in the content game, and Twelve Creative delivers peak quality every single week without exception.",
  },
];

export const TESTIMONIALS_DATA: TTestimonialData = {
  label: "Testimonials",
  title: "What Our Clients Say",
  description: "1,000+ creators trust us to edit their videos.",
  testimonials: TESTIMONIALS,
};
