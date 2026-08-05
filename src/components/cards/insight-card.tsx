import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import type { TInsightCardItem } from "@/data/insights.data";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  item: TInsightCardItem;
  className?: string;
  /**
   * Carousel items share one row height, so the image must not grow with the
   * copy. The list grid has no such constraint and reads better taller.
   */
  imageAspect?: "16/9" | "4/3";
  sizes?: string;
}

export function InsightCard({
  item,
  className,
  imageAspect = "16/9",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: InsightCardProps) {
  const publishedAt = item.published_at ? new Date(item.published_at) : null;
  // An unparseable date from the API would otherwise render "Invalid Date".
  const showDate = publishedAt && !Number.isNaN(publishedAt.getTime());

  return (
    <Link
      href={`/insights/${item.slug}`}
      className={cn(
        "group bg-card border-primary/10 hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-2xl border transition-colors",
        className,
      )}
    >
      <div
        className={cn(
          "bg-muted relative w-full overflow-hidden",
          imageAspect === "4/3" ? "aspect-4/3" : "aspect-16/9",
        )}
      >
        <Image
          src={item.cover}
          alt={item.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-medium">
          {item.category && (
            <>
              <span className="text-primary tracking-wider uppercase">
                {item.category}
              </span>
              <span className="text-muted-foreground/40">·</span>
            </>
          )}
          {showDate && <span>{format(publishedAt, "d MMM yyyy")}</span>}
          {item.read_minutes ? (
            <>
              {showDate && <span className="text-muted-foreground/40">·</span>}
              <span>{item.read_minutes} min read</span>
            </>
          ) : null}
        </div>

        <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
          {item.title}
        </h3>

        <p className="text-muted-foreground line-clamp-3 text-sm">
          {item.excerpt}
        </p>
      </div>
    </Link>
  );
}
