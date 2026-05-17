"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { BookingModal } from "@/components/common/booking-modal";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const Header = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          className,
        )}
      >
        <div className="container pt-3 lg:pt-4">
          <div
            className={cn(
              "bg-card/50 ring-foreground/8 flex h-14 items-center justify-between rounded-2xl px-4 backdrop-blur-xl ring-1 lg:h-16 lg:px-6",
              "shadow-[0_8px_30px_-12px] shadow-foreground/10",
            )}
          >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <LogoIcon className="h-8 w-auto md:h-10" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {SITE.nav.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-semibold whitespace-nowrap transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-foreground/60 hover:text-foreground",
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="bg-primary absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => setIsBookingOpen(true)}
              className={cn(
                buttonVariants({ size: "default" }),
                "from-primary-from to-primary-to hover:shadow-primary hidden bg-linear-to-br px-5 font-semibold shadow-md sm:inline-flex",
              )}
            >
              Start a Conversation
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <HugeiconsIcon
                icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon}
                className="h-5 w-5"
              />
            </button>
          </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="bg-card/80 ring-foreground/8 mt-2 rounded-2xl p-2 ring-1 backdrop-blur-xl shadow-lg lg:hidden">
              <nav className="flex flex-col gap-1 p-2">
              {SITE.nav.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="from-primary-from to-primary-to mt-2 bg-linear-to-br font-semibold"
              >
                Start a Conversation
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Booking Modal — rendered outside header so it's full-screen */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </>
  );
};
