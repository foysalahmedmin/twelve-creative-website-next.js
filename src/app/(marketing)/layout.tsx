import { LiveFooter } from "@/components/partials/footer-live";
import Image from "next/image";
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
          <div className="bg-card/50 ring-foreground/8 flex h-14 items-center justify-center rounded-2xl px-4 backdrop-blur-xl ring-1 shadow-[0_8px_30px_-12px] shadow-foreground/10 lg:h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-full.png"
                alt="Twelve Creative"
                width={160}
                height={40}
                className="h-8 w-auto lg:h-9"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <LiveFooter />
    </div>
  );
}
