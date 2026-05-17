"use client";

import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE } from "@/config/site";
import { FAQS_DATA } from "@/data/faqs.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon, UserCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const FaqSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label="FAQs"
            title="Frequently asked questions."
            description="Everything you need to know before we start the conversation."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[24rem_1fr] lg:gap-8 mt-10 lg:mt-16">
          {/* Left: Founder CTA card */}
          <ScrollReveal animation="fade-in-up" delayMs={100} durationMs={800} className="lg:sticky lg:top-28 lg:self-start">
            <Card className="from-primary/10 to-primary/3 ring-primary/20 relative overflow-hidden bg-linear-to-br p-0 ring-1">
              <div
                aria-hidden
                className="bg-primary/20 absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl"
              />
              <div className="relative flex flex-col items-center gap-5 p-8 text-center sm:p-10">
                {/* Avatar */}
                <div className="bg-card text-primary ring-primary/20 flex h-24 w-24 items-center justify-center rounded-2xl ring-8 shadow-xl">
                  <HugeiconsIcon icon={UserCircle02Icon} className="h-12 w-12" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading text-foreground text-xl font-bold tracking-tight">
                    Have more questions?
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Let&rsquo;s talk it out. Book a quick call and we&rsquo;ll walk you through everything and figure out the best move for your business.
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="font-heading text-foreground text-base font-bold">
                    {SITE.founder.name}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium">
                    {SITE.founder.title}
                  </p>
                </div>

                <Button
                  asChild
                  className="from-primary-from to-primary-to hover:shadow-primary mt-2 h-11 w-full bg-linear-to-br px-6 font-semibold shadow-md"
                >
                  <Link href="/contact">
                    Book a Call
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </ScrollReveal>

          {/* Right: FAQ Accordion */}
          <ScrollReveal animation="fade-in-up" delayMs={200} durationMs={800}>
            <Accordion
              type="single"
              defaultValue={FAQS_DATA[0].id}
              collapsible
              className="bg-transparent border-0 space-y-3 rounded-none"
            >
              {FAQS_DATA.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className={cn(
                    "border-border/60 bg-card overflow-hidden rounded-2xl border not-last:border-b",
                    "data-open:from-primary/8 data-open:to-card data-open:bg-linear-to-br data-open:border-primary/30 data-open:shadow-md",
                  )}
                >
                  <AccordionTrigger className="hover:no-underline px-5 py-5 text-base font-semibold tracking-tight items-center">
                    <span className="text-foreground">Q. {faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-5 text-sm leading-relaxed">
                    {faq.type === "list" && Array.isArray(faq.answer) ? (
                      <ul className="space-y-2">
                        {faq.answer.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="bg-primary/50 mt-2 h-1 w-1 shrink-0 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{faq.answer as string}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
