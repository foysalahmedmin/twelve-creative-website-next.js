import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function VerticalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Logo-only fixed header */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-white/10 bg-black/60 backdrop-blur-xl lg:h-20">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-full.png"
              alt="Twelve Creative"
              width={160}
              height={40}
              className="h-8 w-auto lg:h-10"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm font-medium tracking-wide transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
