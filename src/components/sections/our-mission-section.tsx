import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import type { AboutSectionHeader, AboutValueCard } from "@/lib/api/about-page";
import { cn } from "@/lib/utils";

interface OurMissionSectionProps {
  section: AboutSectionHeader | null;
  mission: AboutValueCard | null;
  vision: AboutValueCard | null;
}

export function OurMissionSection({
  section,
  mission,
  vision,
}: OurMissionSectionProps) {
  if (
    !section?.is_visible ||
    (!mission?.is_visible && !vision?.is_visible)
  ) {
    return null;
  }

  return (
    <section className="bg-muted w-full py-16 sm:py-20 lg:py-24">
      <div className="container">
        <ScrollReveal animation="fade-in-up">
          <CenteredSectionHeader
            title={section.title}
            description={section.description}
            label={section.label}
          />
        </ScrollReveal>

        <div
          className={cn(
            "relative z-10 mt-12 grid grid-cols-1 gap-6 sm:gap-8 lg:mt-16",
            mission?.is_visible && vision?.is_visible
              ? "md:grid-cols-2"
              : "mx-auto max-w-3xl",
          )}
        >
          {mission?.is_visible && (
            <ScrollReveal
              animation="fade-in-left"
              delayMs={150}
              className="h-full"
            >
              <div className="bg-card border-border h-full rounded-2xl border p-8 shadow-sm transition-colors sm:p-10">
                <h3 className="font-heading text-foreground mb-4 text-2xl font-black tracking-tight">
                  {mission.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {mission.description}
                </p>
              </div>
            </ScrollReveal>
          )}

          {vision?.is_visible && (
            <ScrollReveal
              animation="fade-in-right"
              delayMs={300}
              className="h-full"
            >
              <div className="bg-card border-border h-full rounded-2xl border p-8 shadow-sm transition-colors sm:p-10">
                <h3 className="font-heading text-foreground mb-4 text-2xl font-black tracking-tight">
                  {vision.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                  {vision.description}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
