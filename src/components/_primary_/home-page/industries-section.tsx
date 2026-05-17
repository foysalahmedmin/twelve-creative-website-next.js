import { IndustryCard } from "@/components/cards/industry-card";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { INDUSTRIES_DATA } from "@/data/industries.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const IndustriesSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn("bg-muted/40 py-16 sm:py-20 lg:py-28", className)}
    >
      <div className="container">
        <SectionHeader
          label="Industries"
          title="Where trust, presentation, and follow-up matter most."
          description="We work across industries where the buying decision depends on credibility, timing, taste, and a clear path to action."
          centeredOnMobile
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/industries">
              All industries
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </Button>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {INDUSTRIES_DATA.map((industry) => (
            <IndustryCard key={industry.id} industry={industry} />
          ))}
        </div>
      </div>
    </section>
  );
};
