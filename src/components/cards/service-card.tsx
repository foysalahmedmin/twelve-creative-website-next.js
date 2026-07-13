import type { TService, TServiceIconKey } from "@/data/services.data";
import { cn } from "@/lib/utils";
import {
  AnalyticsUpIcon,
  ConnectIcon,
  Megaphone01Icon,
  Settings01Icon,
  Target02Icon,
  Video01Icon,
  GlobalEditingIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

const SERVICE_ICON_MAP: Record<TServiceIconKey, typeof Target02Icon> = {
  positioning: Target02Icon,
  creative: Video01Icon,
  distribution: Megaphone01Icon,
  websites: GlobalEditingIcon,
  automation: Settings01Icon,
  growth: AnalyticsUpIcon,
};

interface ServiceCardProps {
  service: TService;
  className?: string;
}

export const ServiceCard = ({ service, className }: ServiceCardProps) => {
  const Icon = SERVICE_ICON_MAP[service.icon];

  return (
    <div className={cn("group/service relative h-full", className)}>
      {/* Front face — visible by default */}
      <div
        className={cn(
          "bg-muted text-foreground flex h-full flex-col items-start justify-start rounded-2xl px-5 py-6 w-full",
          "transition-all duration-500 ease-out transform",
          "group-hover/service:opacity-0 group-hover/service:-translate-y-6",
        )}
      >
        <h3 className="font-heading text-foreground text-xl font-black tracking-tight leading-tight md:text-2xl">
          {service.title}
        </h3>
        <p className="text-foreground/80 mt-2 text-sm font-normal leading-[140%] md:text-base">
          {service.description}
        </p>
        <div className="mt-auto w-full">
          <div className="relative mt-4 aspect-5/4 w-full overflow-hidden rounded-2xl md:mt-8">
            <Image
              src={service.thumbnail_src}
              alt={service.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Back face — shown on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 w-full h-full",
          "transition-all duration-500 ease-out transform translate-y-6",
          "group-hover/service:pointer-events-auto group-hover/service:opacity-100 group-hover/service:translate-y-0",
        )}
      >
        {/* Card surface */}
        <div className="border-border bg-card h-full w-full rounded-2xl border p-px">
          <div className="bg-card flex h-full w-full flex-col justify-between gap-6 rounded-2xl px-5 py-6 md:py-6">
            {/* Top: icon + title */}
            <div>
              <div className="bg-primary/10 text-primary inline-flex h-11 w-11 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={Icon} className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-foreground mt-3 text-xl font-black tracking-tight leading-tight md:text-2xl">
                {service.title}
              </h3>
            </div>

            {/* Middle: description */}
            <p className="text-muted-foreground text-sm font-normal leading-[140%] md:text-base">
              {service.description}
            </p>

            {/* Bottom: button */}
            <div className="flex w-full justify-end">
              <Link
                href={service.href}
                className={cn(
                  "bg-primary text-primary-foreground rounded-lg px-6 py-3 text-sm font-semibold uppercase tracking-[0.05em] transition-transform duration-200 ease-out",
                  "hover:scale-105 active:scale-95",
                )}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
