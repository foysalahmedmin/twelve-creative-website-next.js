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
  tone?: "default" | "brand";
  className?: string;
}

export const FeatureCard = ({
  feature,
  tone = "default",
  className,
}: FeatureCardProps) => {
  const Icon = FEATURE_ICON_MAP[feature.icon];

  return (
    <div
      className={cn(
        "group/feature relative space-y-3 rounded-2xl border p-6 transition-all duration-300",
        tone === "brand"
          ? "border-[#131C20]/10 bg-[#EAEAE4] shadow-[0_18px_50px_rgba(19,28,32,0.12)] hover:border-[#131C20]/25 hover:bg-[#F2F1EC]"
          : "hover:border-border hover:bg-muted border-transparent hover:shadow-sm",
        className,
      )}
    >
      <div
        className={cn(
          "group-hover/feature:bg-primary text-primary group-hover/feature:text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover/feature:scale-110",
        )}
      >
        <HugeiconsIcon icon={Icon} className="h-6 w-6" />
      </div>

      <h3
        className={cn(
          "font-heading text-lg leading-tight font-black tracking-tight",
          tone === "brand" ? "text-[#131C20]" : "text-foreground",
        )}
      >
        {feature.title}
      </h3>
      <p
        className={cn(
          "text-sm leading-relaxed",
          tone === "brand" ? "text-[#131C20]/65" : "text-muted-foreground",
        )}
      >
        {feature.description}
      </p>
    </div>
  );
};
