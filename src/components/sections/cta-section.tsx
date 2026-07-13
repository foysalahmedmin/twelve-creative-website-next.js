"use client";

import { BrandFrame } from "@/components/common/brand";
import { Button } from "@/components/ui/button";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

export interface TCTAData {
  title: string;
  description: string;
  image: string;
  href: string;
  buttonText: string;
}

interface CTASectionProps {
  data: TCTAData;
  className?: string; // To allow custom spacing/overrides
}

export const CTASection = ({ data, className = "" }: CTASectionProps) => {
  return (
    <section
      className={`bg-brand-artefact relative overflow-hidden py-16 lg:py-24 ${className}`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Image — framed with the brand "box" device */}
          <BrandFrame
            inset
            tone="cream"
            className="w-full sm:max-w-md lg:max-w-lg"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl">
              <Link href={data.href} className="block h-full w-full">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </Link>
            </div>
          </BrandFrame>

          {/* Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="font-heading text-3xl leading-[1.05] font-black tracking-tight text-[#eaeae4] lg:text-5xl">
              {data.title}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed font-medium text-[#eaeae4]/75 sm:text-lg lg:mx-0">
              {data.description}
            </p>
            <div className="pt-2">
              <Button asChild size="xl" variant="secondary">
                <Link href={data.href}>
                  {data.buttonText}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
