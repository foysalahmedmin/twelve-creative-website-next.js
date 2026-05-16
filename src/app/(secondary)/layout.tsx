import { Header } from "@/components/common/header";
import { Footer } from "@/components/partials/footer";
import { MobileBottomNav } from "@/components/partials/mobile-bottom-nav";
import React from "react";

export default function SecondaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pb-16 lg:pb-0">{children}</main>

      <Footer className="hidden lg:block" />
      <MobileBottomNav />
    </div>
  );
}
