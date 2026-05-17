import { ServiceCard } from "@/components/cards/service-card";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { SERVICES_DATA } from "@/data/services.data";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const ServicesSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-muted/40 py-16 sm:py-20 lg:py-28", className)}>
      <div className="container">
        <SectionHeader
          label="What We Build"
          title="The pieces that move a business forward."
          description="Positioning, creative production, websites, ads, CRM, and automation — designed to connect and work together as one system."
          centeredOnMobile
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/what-we-build">
              See all services
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Link>
          </Button>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
