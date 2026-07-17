"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeStore } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { Provider } from "react-redux";
import AuthProvider from "./auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Redux Logic
  const [store] = useState(() => makeStore());

  // React Query Logic
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </TooltipProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </Provider>
  );
}
