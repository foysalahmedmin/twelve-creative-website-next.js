"use client";

import { BRANDS_DATA, type TBrand } from "@/data/brands.data";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const BrandItem = ({ brand }: { brand: TBrand }) => {
  const content = brand.logo_src ? (
    <Image
      src={brand.logo_src}
      alt={brand.alt ?? brand.name}
      width={220}
      height={64}
      className="h-16 w-auto rounded-lg object-contain"
    />
  ) : (
    <span className="text-foreground/55 font-heading whitespace-nowrap text-2xl font-bold tracking-tight">
      {brand.name}
    </span>
  );

  const wrapperClass =
    "mx-6 flex h-16 items-center justify-center select-none lg:mx-10";

  if (brand.href) {
    const external = /^https?:\/\//i.test(brand.href);
    return (
      <Link
        href={brand.href}
        className={`${wrapperClass} focus-visible:ring-primary rounded-lg transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:outline-none`}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={`Visit ${brand.name}`}
      >
        {content}
      </Link>
    );
  }

  if (brand.logo_src) {
    return (
      <div className={wrapperClass}>{content}</div>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
};

interface BrandsSectionProps {
  data?: TBrand[];
  className?: string;
}

export const BrandsSection = ({ data, className }: BrandsSectionProps) => {
  const brands = data && data.length ? data : BRANDS_DATA;
  return (
    <section
      className={cn(
        "relative w-full overflow-hidden py-12",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
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
              {brands.map((brand) => (
                <BrandItem key={brand.id} brand={brand} />
              ))}
            </Marquee>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
