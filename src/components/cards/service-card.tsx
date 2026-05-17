import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { TService, TServiceIconKey } from "@/data/services.data";
import { cn } from "@/lib/utils";
import {
  AnalyticsUpIcon,
  ArrowRight01Icon,
  ConnectIcon,
  Megaphone01Icon,
  Target02Icon,
  Tick02Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const SERVICE_ICON_MAP: Record<TServiceIconKey, typeof Target02Icon> = {
  positioning: Target02Icon,
  creative: Video01Icon,
  distribution: Megaphone01Icon,
  conversion: ConnectIcon,
  growth: AnalyticsUpIcon,
};

interface ServiceCardProps {
  service: TService;
  className?: string;
}

export const ServiceCard = ({ service, className }: ServiceCardProps) => {
  const Icon = SERVICE_ICON_MAP[service.icon];

  return (
    <Card
      className={cn(
        "group/service relative h-full justify-between gap-5 py-7 transition-all duration-300",
        "hover:ring-primary/30 hover:shadow-primary hover:-translate-y-1",
        className,
      )}
    >
      <CardContent className="space-y-5">
        <div className="bg-primary/10 text-primary inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover/service:scale-110">
          <HugeiconsIcon icon={Icon} className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h3 className="font-heading text-foreground text-xl font-semibold tracking-tight">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        <ul className="space-y-2">
          {service.highlights.map((item) => (
            <li
              key={item}
              className="text-foreground/80 flex items-center gap-2 text-sm font-medium"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                className="text-primary h-4 w-4 shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="border-border/60 border-t pt-5">
        <Link
          href={service.href}
          className="text-foreground group-hover/service:text-primary inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
        >
          Learn more
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="h-4 w-4 transition-transform group-hover/service:translate-x-1"
          />
        </Link>
      </CardFooter>
    </Card>
  );
};
