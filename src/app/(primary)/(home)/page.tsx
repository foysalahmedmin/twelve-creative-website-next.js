import { SITE } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twelve Creative — We Build the Structure Behind Growth",
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">

    </div>
  );
}
