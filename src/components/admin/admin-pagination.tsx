import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  path: string;
  page: number;
  totalPages: number;
  query?: Record<string, string | undefined>;
}

export function AdminPagination({
  path,
  page,
  totalPages,
  query = {},
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (nextPage > 1) params.set("page", String(nextPage));
    const search = params.toString();
    return `${path}${search ? `?${search}` : ""}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-muted-foreground text-sm" aria-live="polite">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {page <= 1 ? (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="size-4" /> Previous
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page - 1)}>
              <ChevronLeft className="size-4" /> Previous
            </Link>
          </Button>
        )}
        {page >= totalPages ? (
          <Button variant="outline" size="sm" disabled>
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page + 1)}>
              Next <ChevronRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
