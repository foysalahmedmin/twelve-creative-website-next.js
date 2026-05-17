import { ProcessStepCard } from "@/components/cards/process-step-card";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { PROCESS_DATA } from "@/data/process.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const ProcessSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("bg-background py-16 sm:py-20 lg:py-28", className)}
    >
      <div className="container">
        <SectionHeader
          label="How We Work"
          title="A process built around clarity first."
          description="We don't start by making random assets. We start by understanding what the business is trying to move and what structure needs to be built."
          centeredOnMobile
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/process">
              Full process
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </Button>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROCESS_DATA.map((step) => (
            <ProcessStepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};
