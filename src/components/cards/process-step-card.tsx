import { Card, CardContent } from "@/components/ui/card";
import type { TProcessIconKey, TProcessStep } from "@/data/process.data";
import { cn } from "@/lib/utils";
import {
  Compass01Icon,
  ConnectIcon,
  PaintBrush02Icon,
  Refresh01Icon,
  Rocket01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PROCESS_ICON_MAP: Record<TProcessIconKey, typeof Search01Icon> = {
  understand: Search01Icon,
  position: Compass01Icon,
  build: PaintBrush02Icon,
  launch: Rocket01Icon,
  install: ConnectIcon,
  improve: Refresh01Icon,
};

interface ProcessStepCardProps {
  step: TProcessStep;
  className?: string;
}

export const ProcessStepCard = ({ step, className }: ProcessStepCardProps) => {
  const Icon = PROCESS_ICON_MAP[step.icon];

  return (
    <Card
      className={cn(
        "group/step relative h-full gap-4 py-7 transition-all duration-300",
        "hover:ring-primary/30 hover:shadow-primary",
        className,
      )}
    >
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={Icon} className="h-6 w-6" />
          </div>
          <span className="text-primary/30 group-hover/step:text-primary/60 text-4xl font-bold tracking-tight transition-colors">
            {step.index}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
            {step.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {step.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
