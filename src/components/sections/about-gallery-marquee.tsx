"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { ABOUT_GALLERY_DATA } from "@/data/about.data";

export function AboutGalleryMarquee() {
  return (
    <section className="py-12 sm:py-20 overflow-hidden">
      <div className="flex flex-col gap-6 sm:gap-8">
        
        {/* Row 1 - Left to Right */}
        <Marquee speed={40} gradient={false} direction="left">
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
            {ABOUT_GALLERY_DATA.map((url, idx) => (
              <div key={`row1-${idx}`} className="relative h-48 sm:h-64 lg:h-80 aspect-[4/3] rounded-2xl overflow-hidden border border-primary/10 bg-muted">
                <Image
                  src={url}
                  alt={`Office gallery ${idx}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Marquee>

        {/* Row 2 - Right to Left */}
        <Marquee speed={35} gradient={false} direction="right">
          <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
            {[...ABOUT_GALLERY_DATA].reverse().map((url, idx) => (
              <div key={`row2-${idx}`} className="relative h-48 sm:h-64 lg:h-80 aspect-[4/3] rounded-2xl overflow-hidden border border-primary/10 bg-muted">
                <Image
                  src={url}
                  alt={`Office gallery reversed ${idx}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </Marquee>

      </div>
    </section>
  );
}
