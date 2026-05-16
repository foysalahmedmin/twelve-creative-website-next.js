"use client";

import { Button } from "@/components/ui/button";
import { Clock01Icon, Home01Icon, ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export const ComingSoon = ({
  title,
  description,
}: ComingSoonProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Icon */}
      <div className="bg-primary/8 border-primary/15 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
        <HugeiconsIcon icon={Clock01Icon} className="text-primary h-8 w-8" />
      </div>

      {/* Heading */}
      <h1 className="text-foreground mb-2 text-2xl font-semibold tracking-tight">
        {title}
      </h1>

      <p className="text-primary mb-1 text-sm font-medium">Coming Soon</p>

      {/* Description */}
      <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm leading-relaxed">
        {description ??
          `We are currently building the ${title} page. It will be available shortly. Thank you for your patience.`}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="h-9 rounded-lg px-5 text-sm font-medium"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-1.5 h-4 w-4" />
          Go Back
        </Button>

        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 h-9 rounded-lg px-5 text-sm font-medium text-white">
            <HugeiconsIcon icon={Home01Icon} className="mr-1.5 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
