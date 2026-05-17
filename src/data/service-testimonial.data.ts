export interface ITestimonial {
  id?: string;
  name: string;
  designation: string;
  image: string;
  message?: string;
  video_message?: string;
  category: "message" | "video_message";
  type: string;
}

export const CANVAS_TESTIMONIALS_DATA = {
  title: "What Our Clients Say About Us",
  description: "Listen to business owners and marketing leaders who scaled their positioning, editing, and operations using our structured solutions.",
  data: [
    {
      name: "Johnathan Mercer",
      designation: "CEO, SparkLabs",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&auto=format",
      video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      category: "video_message",
      type: "main",
    },
    {
      name: "Clara Vance",
      designation: "Director of Brand, Apex Inc",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&auto=format",
      video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      category: "video_message",
      type: "main",
    },
    {
      name: "Marcus Aurelius",
      designation: "Founding Partner, Empire Creative",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&auto=format",
      message: "Twelve Creative overhauled our sales deck, product explainer films, and automated scheduling sequences. We doubled our booked sales conversations within the first 30 days of rollout.",
      category: "message",
      type: "main",
    },
    {
      name: "Sophia Martinez",
      designation: "Operations Lead, GrowthFlow",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&auto=format",
      message: "No drop shadows, flat elegant designs, responsive layout, and incredibly detailed checklist highlights. The system runs fully automated behind the scenes. Highly recommended!",
      category: "message",
      type: "main",
    },
    {
      name: "Daniel Foster",
      designation: "VP Marketing, NovaTech",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&auto=format",
      video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      category: "video_message",
      type: "main",
    },
    {
      name: "Elena Richardson",
      designation: "Founder, Style & Co",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&auto=format",
      message: "They turned our static e-commerce brand into a dynamic, media-driven machine. We now produce a massive amount of engaging reels every week effortlessly.",
      category: "message",
      type: "main",
    },
    {
      name: "William Hayes",
      designation: "Head of Product, BaseLayer",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&auto=format",
      video_message: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      category: "video_message",
      type: "main",
    },
    {
      name: "Sara Langford",
      designation: "Director of Content, Orbit",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&auto=format",
      message: "Twelve Creative did an amazing job breaking down our complex SaaS tools into simple, easy to understand explainer content. Great partner to work with.",
      category: "message",
      type: "main",
    },
  ] as ITestimonial[],
};
