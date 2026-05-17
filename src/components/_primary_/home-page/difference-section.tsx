import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { DIFFERENCE_DATA } from "@/data/difference.data";
import { cn } from "@/lib/utils";
import {
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const DifferenceSection = ({ className }: { className?: string }) => {
  const data = DIFFERENCE_DATA;

  return (
    <section
      className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={data.eyebrow}
            title={data.title}
            description={data.description}
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mt-10 lg:mt-16">
          {/* Fragmented */}
          <ScrollReveal animation="fade-in-up" delayMs={100} durationMs={800} className="h-full">
            <Card className="border-border/60 gap-5 py-8 h-full">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground inline-flex h-11 w-11 items-center justify-center rounded-xl">
                    <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
                    {data.fragmented.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {data.fragmented.items.map((item) => (
                    <li
                      key={item}
                      className="text-muted-foreground flex items-start gap-2.5 text-sm leading-relaxed"
                    >
                      <span className="bg-muted-foreground/40 mt-2 h-1 w-1 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Connected */}
          <ScrollReveal animation="fade-in-up" delayMs={200} durationMs={800} className="h-full">
            <Card className="border-border/30 ring-primary/20 from-primary/10 to-card bg-linear-to-br gap-5 py-8 ring-1 shadow-lg h-full">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-md shadow-primary/20">
                    <HugeiconsIcon icon={Tick02Icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
                    {data.connected.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {data.connected.items.map((item) => (
                    <li
                      key={item}
                      className="text-foreground/90 flex items-start gap-2.5 text-sm leading-relaxed font-medium"
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="text-primary mt-0.5 h-4 w-4 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
