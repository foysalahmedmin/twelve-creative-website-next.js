"use client";

import {
  Bell,
  CalendarCheck,
  ChevronDown,
  LogOut,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { signoutAction } from "@/lib/admin/auth-actions";
import type { AdminUser } from "@/lib/admin/types";

interface AdminTopbarProps {
  user: AdminUser;
  pendingBookings?: number;
  unreadMessages?: number;
}

export function AdminTopbar({
  user,
  pendingBookings = 0,
  unreadMessages = 0,
}: AdminTopbarProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await signoutAction();
    } catch {
      setIsSigningOut(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const total = pendingBookings + unreadMessages;

  return (
    <header className="border-border/60 bg-card flex h-14 items-center justify-between border-b px-6">
      <div />

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Inbox"
            >
              <Bell className="size-5" />
              {total > 0 && (
                <span className="bg-destructive text-destructive-foreground absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none">
                  {total > 9 ? "9+" : total}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-foreground text-xs font-bold tracking-widest uppercase">
              Inbox
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/admin/bookings?filter=pending")}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <CalendarCheck className="text-primary size-4" />
                Pending bookings
              </span>
              <span
                className={
                  pendingBookings > 0
                    ? "bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
                    : "text-muted-foreground text-xs tabular-nums"
                }
              >
                {pendingBookings}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/admin/messages?filter=unread")}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Mail className="text-primary size-4" />
                Unread messages
              </span>
              <span
                className={
                  unreadMessages > 0
                    ? "bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
                    : "text-muted-foreground text-xs tabular-nums"
                }
              >
                {unreadMessages}
              </span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/admin/dashboard"
                className="text-muted-foreground hover:text-foreground text-xs font-medium"
              >
                Open dashboard
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-2.5 px-2 py-1.5"
              disabled={isSigningOut}
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
              onClick={handleSignout}
              disabled={isSigningOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              {isSigningOut ? "Signing out…" : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
