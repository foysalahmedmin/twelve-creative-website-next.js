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
      className="border-border bg-background fixed bottom-0 left-0 z-50 w-full border-t pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <div className="container mx-auto px-1">
        <ul className="flex h-[68px] items-center justify-around">
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href} className="flex-1 h-full">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center transition-all duration-300 py-[5px] w-[85%] sm:w-16 rounded-[14px]",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground bg-transparent",
                    )}
                  >
                    <HugeiconsIcon icon={item.icon} size={22} />
                    <span
                      className={cn(
                        "text-[10px] mt-[3px] font-medium tracking-tight truncate w-full text-center px-0.5",
                        isActive ? "text-primary font-semibold" : "",
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
