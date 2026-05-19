"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ABOUT_TEAM_DATA } from "@/data/about.data";
import Image from "next/image";
import { useState } from "react";

export interface TeamSectionItem {
  name: string;
  designation: string;
  photourl: string;
}

interface TeamSectionProps {
  data?: TeamSectionItem[];
}

export function TeamSection({ data }: TeamSectionProps = {}) {
  const members = data && data.length ? data : ABOUT_TEAM_DATA;
  const [visibleCount, setVisibleCount] = useState(6);

  const handleToggle = () => {
    if (visibleCount >= members.length) {
      setVisibleCount(6); // Reset to initial
    } else {
      setVisibleCount((prev) => prev + 3);
    }
  };

  const isShowingAll = visibleCount >= members.length;

  return (
    <section className="container py-16 sm:py-24">
      <div className="bg-primary/5 dark:bg-primary/[0.02] border-primary/10 rounded-[40px] border p-6 sm:p-10 lg:p-16">
        <CenteredSectionHeader
          title="Inside Twelve Creative"
          description="Our office, our team, our everyday moments. The real people behind every edit, every thumbnail, and every deadline we hit for you."
          label="Our Members"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-3">
          {members.slice(0, visibleCount).map((member, idx) => (
            <ScrollReveal key={idx} animation="fade-in-up" delayMs={idx * 100}>
              <div className="group bg-card/60 border-primary/10 hover:border-primary/30 hover:bg-card flex flex-col rounded-3xl border p-4 backdrop-blur-md transition-all sm:p-5">
                <div className="bg-muted relative mb-5 aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={member.photourl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="px-2">
                  <h3 className="font-heading text-foreground mb-1 text-xl font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {member.designation}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {members.length > 6 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleToggle}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3.5 text-sm font-semibold transition-colors"
            >
              {isShowingAll ? "See Less" : "See More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
