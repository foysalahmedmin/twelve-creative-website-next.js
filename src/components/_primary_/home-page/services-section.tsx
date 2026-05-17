import { ServiceCard } from "@/components/cards/service-card";
import { SERVICES_DATA } from "@/data/services.data";
import { cn } from "@/lib/utils";

export const ServicesSection = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "container py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      {/* Header */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-1">
        {/* Glass pill label */}
        <span
          className={cn(
            "text-primary inline-flex items-center justify-center rounded-3xl px-5 py-2.5",
            "bg-card/45 ring-foreground/10 backdrop-blur-md ring-1",
            "text-base font-normal leading-[140%]",
            "shadow-[inset_0_1px_0_var(--color-card),0_2px_6px_-2px_var(--color-foreground)/8%]",
          )}
        >
          Our Services
        </span>

        <h2 className="font-heading text-foreground mt-2 text-center text-[36px] font-medium leading-[120%] tracking-tight md:text-[56px] xl:mt-4">
          Services Built to Move the Business
        </h2>

        <p className="text-muted-foreground mx-auto mt-2 w-full text-center text-sm font-normal leading-[150%] md:text-base xl:w-8/9">
          We help businesses build positioning, creative, and systems that turn attention into revenue.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {SERVICES_DATA.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
};
