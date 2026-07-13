"use client";

import { cn } from "@/lib/utils";
import {
  Briefcase01Icon,
  Building04Icon,
  Home01Icon,
  InformationCircleIcon,
  MessageAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MAIN_NAV_ITEMS = [
  { label: "Home", icon: Home01Icon, href: "/" },
  { label: "Build", icon: Briefcase01Icon, href: "/what-we-build" },
  { label: "Industries", icon: Building04Icon, href: "/industries" },
  { label: "About", icon: InformationCircleIcon, href: "/about" },
  { label: "Contact", icon: MessageAdd01Icon, href: "/contact" },
] as const;

export const MobileBottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 z-50 w-full pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <div className="container px-3 pb-3">
        <div
          className={cn(
            "bg-card/60 ring-foreground/8 flex h-[64px] items-center justify-around rounded-2xl px-2 backdrop-blur-xl ring-1",
            "shadow-[0_8px_30px_-8px] shadow-foreground/15",
          )}
        >
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-center h-full"
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center transition-all duration-300 py-1.5 px-3 rounded-lg",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={21} />
                  <span
                    className={cn(
                      "mt-[3px] text-[10px] font-medium tracking-tight",
                      isActive ? "text-primary font-semibold" : "",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

