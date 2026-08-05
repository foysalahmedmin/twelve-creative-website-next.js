import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";
import { DIFFERENCE_DATA } from "@/data/difference.data";
import { cn } from "@/lib/utils";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { DifferenceSection as CmsDifferenceSection } from "@/lib/api/shared-sections";

interface DifferenceSectionProps {
  className?: string;
  data?: CmsDifferenceSection;
}

export const DifferenceSection = ({
  className,
  data: cmsData,
}: DifferenceSectionProps) => {
  const data = cmsData
    ? {
        eyebrow: cmsData.label ?? "",
        title: cmsData.title,
        description: cmsData.description,
        fragmented: {
          title: cmsData.content.fragmented.title,
          items: cmsData.content.fragmented.items.map((item) => item.text),
        },
        connected: {
          title: cmsData.content.connected.title,
          items: cmsData.content.connected.items.map((item) => item.text),
        },
      }
    : DIFFERENCE_DATA;

  return (
    <section
      className={cn(
        "bg-background border-border/40 border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container">
        <ScrollReveal animation="fade-in-up" durationMs={800}>
          <CenteredSectionHeader
            label={data.eyebrow}
            title={data.title}
            description={data.description}
          />
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-2">
          {/* Fragmented */}
          <ScrollReveal
            animation="fade-in-left"
            delayMs={100}
            durationMs={800}
            className="h-full"
          >
            <Card className="border-border h-full gap-5 py-8">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-muted text-muted-foreground inline-flex h-11 w-11 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-foreground text-lg font-black tracking-tight">
                    {data.fragmented.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {data.fragmented.items.map((item, index) => (
                    <li
                      key={`${index}-${item}`}
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
          <ScrollReveal
            animation="fade-in-right"
            delayMs={200}
            durationMs={800}
            className="h-full"
          >
            {/* border-0, not border-transparent: Card applies a 1px border by
                default, and a transparent border still lets the gradient
                background paint underneath it — which showed as a faint orange
                edge along the top of the card. */}
            <Card className="bg-brand-artefact relative h-full gap-5 overflow-hidden border-0 py-8 shadow-sm">
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-foreground text-primary dark:bg-secondary dark:text-secondary-foreground inline-flex h-11 w-11 items-center justify-center rounded-lg">
                    <HugeiconsIcon icon={Tick02Icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-primary-foreground text-lg font-black tracking-tight dark:text-[#eaeae4]">
                    {data.connected.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {data.connected.items.map((item, index) => (
                    <li
                      key={`${index}-${item}`}
                      className="text-primary-foreground/85 flex items-start gap-2.5 text-sm leading-relaxed font-medium dark:text-[#eaeae4]/85"
                    >
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="text-primary-foreground mt-0.5 h-4 w-4 shrink-0 dark:text-[#eaeae4]"
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
