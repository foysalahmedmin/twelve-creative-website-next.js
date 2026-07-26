import { CmsMediaDisplay } from "@/components/common/cms-media-display";
import type { AboutFounder } from "@/lib/api/about-page";
import { cn } from "@/lib/utils";

interface FounderSectionProps {
  className?: string;
  founder: AboutFounder;
}

export const FounderSection = ({ className, founder }: FounderSectionProps) => {
  if (!founder.is_visible) return null;
  const name = `${founder.first_name} ${founder.last_name}`;

  return (
    <section
      className={cn(
        "bg-background border-border/40 border-t py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="container max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Left: Name + Title + Bio */}
          <div className="flex-1 space-y-8">
            {/* Eyebrow */}
            {founder.eyebrow && (
              <span className="text-foreground border-foreground/25 inline-flex items-center rounded-md border px-3 py-1 text-[11px] font-bold tracking-[0.12em] uppercase">
                {founder.eyebrow}
              </span>
            )}

            {/* Large name — PP Object Sans Heavy */}
            <div className="space-y-2 space-x-1">
              <h2 className="font-heading text-foreground inline-block text-[56px] leading-[100%] font-black tracking-tight sm:text-[72px] lg:text-[90px]">
                {founder.first_name}
              </h2>{" "}
              <h2 className="font-heading text-primary inline-block text-[56px] leading-[100%] font-black tracking-tight sm:text-[72px] lg:text-[90px]">
                {founder.last_name}.
              </h2>
            </div>

            {/* Title */}
            <p className="text-muted-foreground text-sm font-normal tracking-[0.075em] uppercase">
              {founder.title}
            </p>

            <div className="relative w-full max-w-sm shrink-0 lg:hidden">
              <div className="border-border bg-card relative aspect-square w-full overflow-hidden rounded-2xl border">
                <CmsMediaDisplay
                  media={founder.media}
                  alt={`${name} — ${founder.title}`}
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 100vw, 320px"
                  priority
                />
              </div>
            </div>

            {/* Bio */}
            <div className="border-primary space-y-4 border-l-2 pl-6">
              {founder.biography.map((paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(0, 24)}`}
                  className={cn(
                    "text-base leading-[170%]",
                    index === 0
                      ? "text-foreground/80 font-medium sm:text-lg"
                      : "text-muted-foreground",
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: Photo */}
          <div className="relative hidden w-full max-w-sm shrink-0 lg:block lg:w-96">
            <div className="border-border bg-card relative aspect-3/4 w-full overflow-hidden rounded-2xl border">
              <CmsMediaDisplay
                media={founder.media}
                alt={`${name} — ${founder.title}`}
                className="absolute inset-0"
                sizes="(max-width: 1024px) 100vw, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
