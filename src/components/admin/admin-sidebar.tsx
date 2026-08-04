"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoIcon } from "@/components/icons/logo-icon";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/admin/types";
import { ADMIN_NAV } from "./admin-nav-config";

interface AdminSidebarProps {
  user: AdminUser;
  className?: string;
}

export function AdminSidebar({ user, className }: AdminSidebarProps) {
  const pathname = usePathname();

  const allowedNav = ADMIN_NAV.filter(
    (entry) =>
      entry.type === "section" || !entry.roles || entry.roles.includes(user.role),
  );

  // A group whose every item was just filtered out by role would otherwise
  // leave its header stranded above the next group. A header only survives if
  // an actual item follows it.
  const visibleNav = allowedNav.filter((entry, i) => {
    if (entry.type !== "section") return true;
    const next = allowedNav[i + 1];
    return next !== undefined && next.type !== "section";
  });

  return (
    <aside
      className={cn(
        "border-border/60 bg-card flex h-full w-64 flex-col border-r",
        className,
      )}
    >
      {/* Brand */}
      <div className="border-border/60 flex h-14 items-center gap-2.5 border-b px-5">
        <LogoIcon symbol className="w-8" />
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
          {visibleNav.map((entry, i) => {
            if (entry.type === "section") {
              return (
                <li key={`section-${i}`} className="pt-4 pb-1">
                  <span className="text-muted-foreground/60 px-3 text-[10px] font-bold tracking-widest uppercase">
                    {entry.label}
                  </span>
                </li>
              );
            }

            const Icon = entry.icon;
            const isActive =
              pathname === entry.href ||
              (entry.href !== "/admin" && pathname?.startsWith(entry.href + "/"));

            return (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  <span className="flex-1 truncate">{entry.label}</span>
                  {entry.soon && (
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
