"use client";

import { useState } from "react";
import Image from "next/image";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { ABOUT_TEAM_DATA } from "@/data/about.data";
import { cn } from "@/lib/utils";

export function AboutTeam() {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleToggle = () => {
    if (visibleCount >= ABOUT_TEAM_DATA.length) {
      setVisibleCount(6); // Reset to initial
    } else {
      setVisibleCount(prev => prev + 3);
    }
  };

  const isShowingAll = visibleCount >= ABOUT_TEAM_DATA.length;

  return (
    <section className="container py-16 sm:py-24">
      <div className="bg-primary/5 dark:bg-primary/[0.02] border border-primary/10 rounded-[40px] p-6 sm:p-10 lg:p-16">
        
        <CenteredSectionHeader
          title="Inside Twelve Creative"
          description="Our office, our team, our everyday moments. The real people behind every edit, every thumbnail, and every deadline we hit for you."
          label="Our Members"
        />

        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ABOUT_TEAM_DATA.slice(0, visibleCount).map((member, idx) => (
            <ScrollReveal key={idx} animation="fade-in-up" delayMs={idx * 100}>
              <div className="group flex flex-col bg-card/60 backdrop-blur-md border border-primary/10 rounded-3xl p-4 sm:p-5 transition-all hover:border-primary/30 hover:bg-card">
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-muted mb-5">
                  <Image
                    src={member.photourl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="px-2">
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {member.designation}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {ABOUT_TEAM_DATA.length > 6 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleToggle}
              className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {isShowingAll ? "See Less" : "See More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
