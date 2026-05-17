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
      className={cn("bg-background py-16 sm:py-20 lg:py-28", className)}
    >
      <div className="container">
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
          <span className="border-primary text-primary border-l-[0.125em] pl-[0.5em] text-xs font-bold tracking-wider uppercase">
            {data.eyebrow}
          </span>
          <h2 className="font-heading text-foreground mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {data.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Fragmented */}
          <Card className="border-border/60 gap-5 py-8">
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

          {/* Connected */}
          <Card className="ring-primary/30 from-primary/8 to-card bg-linear-to-br gap-5 py-8">
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground inline-flex h-11 w-11 items-center justify-center rounded-xl">
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
        </div>
      </div>
    </section>
  );
};
