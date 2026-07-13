"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import type { TContactCard, TContactCardKey } from "@/data/contact.data";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight01Icon,
  Briefcase01Icon,
  InformationCircleIcon,
  Location04Icon,
  Mail01Icon,
  MessageMultiple01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const CONTACT_ICON_MAP: Record<TContactCardKey, typeof Mail01Icon> = {
  email: Mail01Icon,
  whatsapp: MessageMultiple01Icon,
  work: Briefcase01Icon,
  explore: InformationCircleIcon,
};

interface ContactInfoMapSectionProps {
  label: string;
  title: string;
  description: string;
  cards: TContactCard[];
  map: {
    address: string;
    embed_src: string;
  };
  className?: string;
}

export const ContactInfoMapSection = ({
  label,
  title,
  description,
  cards,
  map,
  className,
}: ContactInfoMapSectionProps) => {
  return (
    <section className={cn("container py-16 sm:py-20 lg:py-24", className)}>
      <ScrollReveal animation="fade-in-up" durationMs={800}>
        <CenteredSectionHeader
          label={label}
          title={title}
          description={description}
          className="mb-10 lg:mb-16"
        />
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left: Contact cards */}
        <ScrollReveal animation="fade-in-up" delayMs={150} durationMs={800}>
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
            {cards.map((card) => {
              const Icon = CONTACT_ICON_MAP[card.id];
              const isExternal =
                card.href.startsWith("mailto:") ||
                card.href.startsWith("tel:") ||
                card.href.startsWith("http");

              return (
                <Link
                  key={card.id}
                  href={card.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="group/contact-card border-border bg-card hover:border-primary/40 flex h-full w-full rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex h-full w-full items-center justify-between gap-4 p-5">
                    {/* Texts */}
                    <div className="flex-1 space-y-1 truncate">
                      <h4 className="font-heading text-foreground group-hover/contact-card:text-primary flex items-center gap-1.5 truncate text-base font-semibold transition-colors sm:text-lg">
                        {card.title}
                        <HugeiconsIcon
                          icon={ArrowUpRight01Icon}
                          className="size-4 shrink-0 opacity-0 transition-all duration-200 group-hover/contact-card:opacity-100"
                        />
                      </h4>
                      <p className="text-muted-foreground truncate text-xs sm:text-sm">
                        {card.value}
                      </p>
                    </div>

                    {/* Icon tile */}
                    <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg border">
                      <HugeiconsIcon icon={Icon} className="size-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Right: Map */}
        <ScrollReveal animation="fade-in-up" delayMs={300} durationMs={800}>
          <div className="border-border bg-card relative h-full min-h-80 w-full rounded-2xl border p-px">
            <div className="bg-background relative h-full min-h-80 w-full overflow-hidden rounded-2xl">
              {/* Address badge */}
              <div className="bg-card/95 border-border absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-md backdrop-blur-md">
                <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={Location04Icon} className="size-4" />
                </div>
                <span className="text-foreground text-sm font-semibold">
                  {map.address}
                </span>
              </div>

              <iframe
                src={map.embed_src}
                title={`Twelve Creative office — ${map.address}`}
                className="h-full min-h-80 w-full border-0 contrast-[1.02] grayscale-[0.2]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
