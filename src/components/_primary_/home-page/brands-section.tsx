"use client";

import { BRANDS_DATA, type TBrand } from "@/data/brands.data";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import Image from "next/image";
import Marquee from "react-fast-marquee";

const BrandItem = ({ brand }: { brand: TBrand }) => {
  if (brand.logo_src) {
    return (
      <div className="pointer-events-none mx-4 flex items-center justify-center select-none lg:mx-6">
        <Image
          src={brand.logo_src}
          alt={brand.alt ?? brand.name}
          width={180}
          height={50}
          className="h-[50px] w-auto rounded-lg object-contain"
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none mx-4 flex h-[50px] items-center justify-center select-none lg:mx-6">
      <span className="text-foreground/55 font-heading whitespace-nowrap text-xl font-bold tracking-tight">
        {brand.name}
      </span>
    </div>
  );
};

export const BrandsSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "relative mx-auto mt-10 w-full max-w-7xl overflow-hidden px-6 py-6",
        className,
      )}
    >
      <ScrollReveal animation="fade-in" durationMs={800}>
        <div
          className="mx-auto flex w-full flex-col items-center justify-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover
            autoFill
            className="flex items-center"
          >
            {BRANDS_DATA.map((brand) => (
              <BrandItem key={brand.id} brand={brand} />
            ))}
          </Marquee>
        </div>
      </ScrollReveal>
    </section>
  );
};
