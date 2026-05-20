import { ScrollReveal } from "@/components/common/scroll-reveal";
import { CenteredSectionHeader } from "@/components/common/section-label";
import { ABOUT_MISSION_DATA } from "@/data/about.data";

export function OurMissionSection() {
  return (
    <section className="container py-16 sm:py-24">
      <div className="bg-primary/5 dark:bg-primary/[0.02] border-primary/10 relative overflow-hidden rounded-[40px] border p-6 sm:p-10 lg:p-16">
        <ScrollReveal animation="fade-in-up">
          <CenteredSectionHeader
            title="Built for Strategic Execution"
            description="We build the structure that help businesses become understood, trusted, and easier to buy from."
            label="Our Mission"
          />
        </ScrollReveal>

        <div className="relative z-10 mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:mt-16">
          <ScrollReveal animation="fade-in-left" delayMs={150} className="h-full">
            <div className="bg-card border-primary/10 hover:border-primary/20 h-full rounded-3xl border p-8 transition-colors sm:p-10">
              <h3 className="font-heading text-foreground mb-4 text-2xl font-semibold">
                {ABOUT_MISSION_DATA.mission.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {ABOUT_MISSION_DATA.mission.desc}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-right" delayMs={300} className="h-full">
            <div className="bg-card border-primary/10 hover:border-primary/20 h-full rounded-3xl border p-8 transition-colors sm:p-10">
              <h3 className="font-heading text-foreground mb-4 text-2xl font-semibold">
                {ABOUT_MISSION_DATA.vision.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {ABOUT_MISSION_DATA.vision.desc}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
