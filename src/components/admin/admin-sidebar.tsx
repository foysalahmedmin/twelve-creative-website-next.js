"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/admin/types";
import { ADMIN_NAV } from "./admin-nav-config";

interface AdminSidebarProps {
  user: AdminUser;
  className?: string;
}

export function AdminSidebar({ user, className }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleNav = ADMIN_NAV.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );

  return (
    <aside
      className={cn(
        "border-border/60 bg-card flex h-full w-64 flex-col border-r",
        className,
      )}
    >
      {/* Brand */}
      <div className="border-border/60 flex h-14 items-center gap-2.5 border-b px-5">
        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg font-bold">
          12
        </div>
        <div className="flex flex-col">
          <span className="font-heading text-foreground text-sm font-semibold leading-tight">
            Twelve Creative
          </span>
          <span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname?.startsWith(item.href + "/"));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.soon && (
                    <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                      Soon
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
