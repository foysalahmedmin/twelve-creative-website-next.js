import { PROBLEM_DATA } from "@/data/problem.data";
import { cn } from "@/lib/utils";

export const ProblemSection = ({ className }: { className?: string }) => {
  const data = PROBLEM_DATA;

  return (
    <section
      className={cn("bg-background py-16 sm:py-20 lg:py-28", className)}
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="border-primary text-primary border-l-[0.125em] pl-[0.5em] text-xs font-bold tracking-wider uppercase">
            {data.eyebrow}
          </span>

          <h2 className="font-heading text-foreground mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {data.title}
          </h2>

          <div className="text-muted-foreground mt-8 space-y-5 text-base leading-relaxed sm:text-lg">
            {data.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <p className="text-foreground mt-10 text-xl font-semibold sm:text-2xl">
            {data.conclusion}
          </p>
        </div>
      </div>
    </section>
  );
};
