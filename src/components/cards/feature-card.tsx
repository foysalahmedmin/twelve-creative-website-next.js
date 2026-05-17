import { Card, CardContent } from "@/components/ui/card";
import type { TFeature, TFeatureIconKey } from "@/data/why-choose-us.data";
import { cn } from "@/lib/utils";
import {
  BulbIcon,
  ChartAverageIcon,
  ConnectIcon,
  HandHelpingIcon,
  Settings01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const FEATURE_ICON_MAP: Record<TFeatureIconKey, typeof BulbIcon> = {
  strategy: BulbIcon,
  cinematic: Video01Icon,
  connected: ConnectIcon,
  systems: Settings01Icon,
  outcomes: ChartAverageIcon,
  embedded: HandHelpingIcon,
};

interface FeatureCardProps {
  feature: TFeature;
  className?: string;
}

export const FeatureCard = ({ feature, className }: FeatureCardProps) => {
  const Icon = FEATURE_ICON_MAP[feature.icon];

  return (
    <Card
      size="sm"
      className={cn(
        "group/feature h-full gap-3 py-6 transition-all duration-300",
        "hover:ring-primary/30 hover:-translate-y-1",
        className,
      )}
    >
      <CardContent className="space-y-3">
        <div className="bg-primary/10 text-primary inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover/feature:scale-110">
          <HugeiconsIcon icon={Icon} className="h-5 w-5" />
        </div>

        <h3 className="font-heading text-foreground text-base font-semibold tracking-tight">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};
