"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Accordion } from "@/components/common/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface AccordionItem {
  question: string;
  answer: string;
}

export interface PageFaqSectionProps {
  data?: {
    image: string;
    alt: string;
    heading: string;
    description: string;
    name: string;
    position: string;
    contact_link: string;
    accordion_items: AccordionItem[];
  };
  className?: string;
}

const DEFAULT_FAQ_DATA = {
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&auto=format",
  alt: "Safwan Wafif - Project Coordinator",
  heading: "Have more questions?",
  description: "Still curious? Let’s talk it out. Book a quick call. We’ll walk you through everything and help you figure out the best move for your brand.",
  name: "Safwan Wafif",
  position: "Project Co-ordinator",
  contact_link: "https://calendly.com/imonofficial2/30min",
  accordion_items: [
    {
      question: "Do you optimize for different platforms?",
      answer: "Yes. We cut each feed: hooks fast, captions clean, pacing tuned, and the right crop. You get platform-ready exports, thumbnails, SRTs, and titles.",
    },
    {
      question: "What do I need to send you?",
      answer: "Raw footage, brand kit, logos, scripts or talking points, your goal, and any refs you like. Share via Drive or Dropbox. If unsure, send it. We will be short.",
    },
    {
      question: "Can you turn one long video into lots of short clips?",
      answer: "Yes. We mine one recording for 8-12 strong hooks, cut clean clips, add captions and roll, then export 9:16, 1:1, 16:9 so you can post across channels.",
    },
    {
      question: "How many revision rounds do I get?",
      answer: "Two rounds per edit. Most wrap in one. Leave time-stamped notes, and we turn them fast. Need extra versions or a new direction? We will confirm the scope first.",
    },
  ],
};

export const PageFaqSection = ({ data = DEFAULT_FAQ_DATA, className }: PageFaqSectionProps) => {
  const { image, alt, heading, description, name, position, contact_link, accordion_items = [] } = data;

  return (
    <section id="faq" className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know before we get started."
          className="mb-10 sm:mb-16"
        />
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 lg:mt-16 items-start">
        {/* Left Coordinator Profile Card */}
        <ScrollReveal animation="fade-in-up" className="lg:sticky lg:top-32 max-w-[420px] mx-auto lg:max-w-full w-full">
          <div className="w-full h-full max-w-[420px] mx-auto rounded-[32px] bg-gradient-to-br from-primary/35 to-primary/5 dark:to-primary/2 p-[1px] flex transition-all duration-300 hover:scale-[102%]">
            <div className="rounded-[31px] bg-card w-full h-full flex flex-col items-center text-center p-8 sm:p-10 space-y-6">
              
              {/* Profile Image with dual ring */}
              <div className="size-28 relative rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-background shrink-0">
                <div className="w-full h-full relative rounded-full overflow-hidden">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="112px"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-xl sm:text-2xl text-foreground">
                  {heading}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Coordinator Metadata */}
              <div className="space-y-1">
                <h4 className="font-heading font-semibold text-lg text-foreground">
                  {name}
                </h4>
                <p className="text-primary text-xs sm:text-sm font-semibold tracking-wide uppercase">
                  {position}
                </p>
              </div>

              {/* Action Button */}
              <Link
                href={contact_link}
                target="_blank"
                className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-semibold text-center select-none hover:scale-105 active:scale-95 duration-200 transition-transform"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Accordion Questions list */}
        <ScrollReveal animation="fade-in-up" delayMs={200} className="lg:col-span-2 w-full">
          <Accordion items={accordion_items} />
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PageFaqSection;
