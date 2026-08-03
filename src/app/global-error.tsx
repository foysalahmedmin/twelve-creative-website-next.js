"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown by the root layout itself (font loading, Providers,
 * WhatsAppFloat, ScrollRestoration) — the one class of error the regular
 * error.tsx can't see, since that boundary lives *inside* the root layout it
 * would need to replace. Next.js requires this file to render its own
 * <html>/<body>, so it deliberately avoids importing the app's Button/icon
 * components or Providers: those are exactly what may have just failed, and
 * this boundary needs to render even when they can't.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed sm:text-base">
          Something went wrong on our end. Our tech team has been notified.
          Please try refreshing the page or contact support if the issue
          persists.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-primary text-primary-foreground h-10 rounded-xl px-10 text-xs font-bold shadow-md transition-all active:scale-95"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
