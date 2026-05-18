import { ScrollReveal } from "@/components/common/scroll-reveal";
import type { TIndustry } from "@/data/industries.data";
import { cn } from "@/lib/utils";

interface IndustriesDetailSectionProps {
  data: TIndustry[];
  className?: string;
}

export const IndustriesDetailSection = ({
  data,
  className,
}: IndustriesDetailSectionProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className={cn("container py-12 md:py-16 lg:py-20", className)}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
        {data.map((industry, index) => (
          <ScrollReveal
            key={industry.id}
            animation="fade-in-up"
            delayMs={index * 100}
            durationMs={700}
          >
            <div
              id={industry.id}
              className="bg-card border-border/50 flex scroll-mt-24 flex-col gap-5 rounded-2xl border p-6 sm:p-8"
            >
              {/* Accent line */}
              <div className="bg-primary/50 h-px w-10 rounded-full" />

              {/* Number + industry name */}
              <div className="flex items-center gap-3">
                <span className="text-foreground/25 font-heading tabular-nums text-sm font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-widest uppercase">
                  {industry.name}
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-heading text-foreground text-xl font-medium tracking-tight sm:text-2xl">
                {industry.headline}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {industry.description}
              </p>

              {/* Divider */}
              <div className="border-border/30 border-t" />

              {/* Work list — 2 columns */}
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {industry.work.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/70 flex items-center gap-2 text-xs font-medium"
                  >
                    <span className="bg-primary/40 size-1 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
};
