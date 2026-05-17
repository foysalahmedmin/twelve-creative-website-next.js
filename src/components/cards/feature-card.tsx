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
  featured?: boolean;
  className?: string;
}

export const FeatureCard = ({
  feature,
  featured = false,
  className,
}: FeatureCardProps) => {
  const Icon = FEATURE_ICON_MAP[feature.icon];

  return (
    <div
      className={cn(
        "group/feature hover:from-primary/8 hover:to-card hover:ring-primary/30 relative space-y-3 rounded-3xl p-6 transition-all duration-300 hover:bg-linear-to-br hover:shadow-md hover:ring-1",
        className,
      )}
    >
      <div
        className={cn(
          "group-hover/feature:bg-primary text-primary group-hover/feature:text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover/feature:scale-110",
        )}
      >
        <HugeiconsIcon icon={Icon} className="h-6 w-6" />
      </div>

      <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};
