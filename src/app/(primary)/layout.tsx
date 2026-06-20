import { LiveHeader } from "@/components/partials/header-live";
import { LiveFooter } from "@/components/partials/footer-live";
import { MobileBottomNav } from "@/components/partials/mobile-bottom-nav";
import React from "react";

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <LiveHeader />

      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      <LiveFooter />
      <MobileBottomNav />
    </div>
  );
}
