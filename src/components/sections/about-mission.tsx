import { CenteredSectionHeader } from "@/components/common/section-label";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { ABOUT_MISSION_DATA } from "@/data/about.data";

export function AboutMission() {
  return (
    <section className="container py-16 sm:py-24">
      <div className="bg-primary/5 dark:bg-primary/[0.02] border border-primary/10 rounded-[40px] p-6 sm:p-10 lg:p-16 relative overflow-hidden">
        
        <ScrollReveal animation="fade-in-up">
          <CenteredSectionHeader
            title="Built for Strategic Execution"
            description="We build the structure that help businesses become understood, trusted, and easier to buy from."
            label="Our Mission"
          />
        </ScrollReveal>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          <ScrollReveal animation="fade-in-up" delayMs={150} className="h-full">
            <div className="h-full bg-card rounded-3xl p-8 sm:p-10 border border-primary/10 hover:border-primary/20 transition-colors">
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
                {ABOUT_MISSION_DATA.mission.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {ABOUT_MISSION_DATA.mission.desc}
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-in-up" delayMs={300} className="h-full">
            <div className="h-full bg-card rounded-3xl p-8 sm:p-10 border border-primary/10 hover:border-primary/20 transition-colors">
              <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
                {ABOUT_MISSION_DATA.vision.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {ABOUT_MISSION_DATA.vision.desc}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
