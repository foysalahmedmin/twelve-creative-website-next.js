import { SectionLabel } from "@/components/common/section-label";
import { PROBLEM_DATA } from "@/data/problem.data";
import { cn } from "@/lib/utils";

export const ProblemSection = ({ className }: { className?: string }) => {
  const data = PROBLEM_DATA;

  return (
    <section
      className={cn("bg-background py-20 sm:py-24 lg:py-32", className)}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="mb-5">{data.eyebrow}</SectionLabel>

          <h2 className="font-heading text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {data.title}
          </h2>

          <div className="text-muted-foreground mt-8 space-y-5 text-base leading-relaxed sm:text-lg">
            {data.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <p className="from-primary-from to-primary-to mt-10 inline-block bg-linear-to-r bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            {data.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
};
