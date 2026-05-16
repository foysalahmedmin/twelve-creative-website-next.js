"use client";

import { ApiMeta } from "@/types/api.type";

interface PaginationProps {
  meta: ApiMeta;
  isFetching?: boolean;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  meta,
  isFetching = false,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const { totalPages, total } = meta;
  const page = currentPage ?? meta.page;

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1 || isFetching}
          className="border-border text-foreground hover:bg-muted disabled:text-muted-foreground flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          ← Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isNearCurrent = Math.abs(p - page) <= 1;
          const isEdge = p === 1 || p === totalPages;

          if (!isNearCurrent && !isEdge) {
            if (p === 2 || p === totalPages - 1) {
              return (
                <span key={p} className="text-muted-foreground px-1 text-sm">
                  …
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={isFetching}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all disabled:cursor-not-allowed ${p === page
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-muted"
                }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || isFetching}
          className="border-border text-foreground hover:bg-muted disabled:text-muted-foreground flex h-9 items-center rounded-lg border px-4 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Meta Info */}
      <p className="text-muted-foreground text-center text-xs">
        Page {page} of {totalPages} — {total} total results
      </p>
    </div>
  );
};
