import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IWorkItem } from "@/data/works.data";
import { cn } from "@/lib/utils";

interface WorksCardProps {
  item: IWorkItem;
  className?: string;
}

export function WorksCard({ item, className }: WorksCardProps) {
  return (
    <Link
      href={`/works/${item.slug}`}
      className={cn(
        "group relative flex flex-col rounded-[24px] bg-card border border-primary/10 overflow-hidden transition-all duration-300 hover:border-primary/30",
        className
      )}
    >
      {/* Image Header container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        <Image
          src={item.image_url}
          alt={item.image_alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Category Badge overlay */}
        <span className="absolute top-4 left-4 bg-primary/10 dark:bg-primary/20 backdrop-blur-md text-[#ea692d] text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border border-primary/10">
          {item.type}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6 sm:p-8">
        <h3 className="font-heading text-xl font-semibold text-foreground leading-snug mb-3 transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
          {item.description}
        </p>

        {/* Metrics Grid */}
        <div className="flex items-center gap-4 mb-8">
          {item.metrics.map((metric, idx) => (
            <div key={metric.label} className="flex items-center gap-4 flex-1">
              {idx !== 0 && <div className="w-[1px] h-10 bg-primary/10" />}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-semibold">
                  {metric.label}
                </span>
                <span className="text-lg font-semibold text-[#ea692d]">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info (pushed to bottom) */}
        <div className="mt-auto border-t border-primary/10 pt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground/80">
            {new Date(item.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-sm font-semibold text-[#ea692d] flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
            Read case study
            <ArrowRight size={16} className="-rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}
