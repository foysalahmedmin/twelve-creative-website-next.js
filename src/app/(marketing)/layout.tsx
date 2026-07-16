import { LogoIcon } from "@/components/icons/logo-icon";
import { LiveFooter } from "@/components/partials/footer-live";
import Link from "next/link";
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Marketing header — centered logo only */}
      <header className="fixed inset-x-0 top-0 z-50 w-full">
        <div className="container pt-3 lg:pt-4">
          <div className="bg-card/50 ring-foreground/8 shadow-foreground/10 flex h-14 items-center justify-center rounded-2xl px-4 shadow-[0_8px_30px_-12px] ring-1 backdrop-blur-xl lg:h-16">
            <Link href="/" className="flex items-center">
              <LogoIcon compact className="h-8 w-auto md:h-10" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <LiveFooter />
    </div>
  );
}
