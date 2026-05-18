"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/admin/auth-actions";
import type { AdminUser } from "@/lib/admin/types";

interface AdminTopbarProps {
  user: AdminUser;
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="border-border/60 bg-card flex h-14 items-center justify-between border-b px-6">
      <div />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto gap-2.5 px-2 py-1.5"
            disabled={isLoggingOut}
          >
            <span className="bg-primary/15 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
              {initials || "?"}
            </span>
            <span className="hidden flex-col items-start sm:flex">
              <span className="text-foreground text-sm font-medium leading-tight">
                {user.name}
              </span>
              <span className="text-muted-foreground text-[11px] leading-tight capitalize">
                {user.role}
              </span>
            </span>
            <ChevronDown className="text-muted-foreground size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs font-normal">
              {user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
