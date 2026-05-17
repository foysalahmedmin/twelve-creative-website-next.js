import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { TIndustry, TIndustryIconKey } from "@/data/industries.data";
import { cn } from "@/lib/utils";
import {
  Airplane01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  Building04Icon,
  Restaurant01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const INDUSTRY_ICON_MAP: Record<TIndustryIconKey, typeof Restaurant01Icon> = {
  hospitality: Restaurant01Icon,
  "real-estate": Building04Icon,
  aviation: Airplane01Icon,
  "professional-services": Briefcase01Icon,
};

interface IndustryCardProps {
  industry: TIndustry;
  className?: string;
}

export const IndustryCard = ({ industry, className }: IndustryCardProps) => {
  const Icon = INDUSTRY_ICON_MAP[industry.icon];

  return (
    <Card
      className={cn(
        "group/industry relative h-full justify-between gap-5 py-7 transition-all duration-300",
        "hover:ring-primary/30 hover:shadow-primary hover:-translate-y-1",
        className,
      )}
    >
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover/industry:scale-110">
            <HugeiconsIcon icon={Icon} className="h-6 w-6" />
          </div>
          <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            {industry.name}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-foreground text-xl font-semibold tracking-tight leading-tight">
            {industry.headline}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {industry.description}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
          {industry.work.map((item) => (
            <li
              key={item}
              className="text-foreground/80 flex items-start gap-1.5 text-xs font-medium"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="border-border/60 border-t pt-5">
        <Link
          href={industry.href}
          className="text-foreground group-hover/industry:text-primary inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          Explore work
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="h-4 w-4 transition-transform group-hover/industry:translate-x-1"
          />
        </Link>
      </CardFooter>
    </Card>
  );
};
