"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon, Home01Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceDeactivatedProps {
  serviceName?: string;
  description?: string;
  launch_date?: string;
}

export const ServiceDeactivated = ({
  serviceName = "This Service",
  description,
  launch_date,
}: ServiceDeactivatedProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="bg-primary/8 border-primary/15 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
        <HugeiconsIcon icon={Settings01Icon} className="text-primary h-8 w-8" />
      </div>

      {/* Heading */}
      <h1 className="text-foreground mb-2 text-2xl font-semibold tracking-tight">
        {serviceName}
      </h1>

      <p className="text-primary mb-1 text-sm font-medium">Coming Soon</p>

      {launch_date && (
        <p className="text-muted-foreground mb-2 text-xs">
          Expected launch: <span className="font-medium">{launch_date}</span>
        </p>
      )}

      {/* Description */}
      <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm leading-relaxed">
        {description ??
          `${serviceName} is currently being integrated with our systems. We are working to make it available as soon as possible.`}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="h-9 rounded-lg px-5 text-sm font-medium"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={16} className="mr-1.5" />
          Go Back
        </Button>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-lg px-5 text-sm font-medium">
            <HugeiconsIcon icon={Home01Icon} size={16} className="mr-1.5" />
            Return Home
          </Button>
        </Link>
      </div>

      <div className="mt-12 flex items-center gap-3">
        <div className="h-px w-10 bg-border" />
        <span className="text-muted-foreground text-xs tracking-wider uppercase">
          Twelve Creative Healthcare
        </span>
        <div className="h-px w-10 bg-border" />
      </div>
    </div>
  );
};
