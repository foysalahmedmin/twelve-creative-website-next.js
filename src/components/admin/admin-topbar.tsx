"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CalendarCheck,
  ChevronDown,
  LogOut,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/api/notifications-actions";
import type { ApiNotificationRecipient } from "@/lib/api/notifications";

interface AdminTopbarProps {
  user: AdminUser;
  notifications?: ApiNotificationRecipient[];
  unreadCount?: number;
}

function relativeTime(date: string) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  booking: <CalendarCheck className="text-primary size-3.5 shrink-0 mt-0.5" />,
  contact: <Mail className="text-primary size-3.5 shrink-0 mt-0.5" />,
};

export function AdminTopbar({
  user,
  notifications = [],
  unreadCount = 0,
}: AdminTopbarProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [notifError, setNotifError] = useState<string | null>(null);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await signoutAction();
    } catch {
      setIsSigningOut(false);
    }
  };

  const handleMarkRead = (id: string, targetRead: boolean) => {
    setNotifError(null);
    startTransition(async () => {
      const result = await markNotificationReadAction(id, targetRead);
      if (result.ok) router.refresh();
      else setNotifError(result.error ?? "Failed to update notification");
    });
  };

  const handleMarkAll = () => {
    setNotifError(null);
    startTransition(async () => {
      const result = await markAllNotificationsReadAction();
      if (result.ok) router.refresh();
      else setNotifError(result.error ?? "Failed to mark all as read");
    });
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

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="text-foreground p-0 text-xs font-bold tracking-widest uppercase">
                Notifications
              </DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-foreground text-[11px] font-medium transition-colors disabled:opacity-50"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />

            {notifError && (
              <p className="text-destructive px-3 py-2 text-xs font-medium">
                {notifError}
              </p>
            )}

            {notifications.length === 0 ? (
              <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                No notifications yet
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`flex cursor-pointer items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-accent ${
                      !n.is_read ? "bg-primary/3" : ""
                    }`}
                    onClick={() => {
                      if (!n.is_read) handleMarkRead(n._id, true);
                      if (n.metadata?.url) router.push(n.metadata.url);
                      else if (n.notification.type === "booking")
                        router.push("/admin/bookings");
                      else if (n.notification.type === "contact")
                        router.push("/admin/messages");
                    }}
                  >
                    {/* Unread dot */}
                    <span className="mt-1.5 shrink-0">
                      {n.is_read ? (
                        <span className="block size-2 rounded-full" />
                      ) : (
                        <span className="bg-primary block size-2 rounded-full" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-1.5">
                        {TYPE_ICON[n.notification.type]}
                        <span
                          className={`text-sm leading-snug ${
                            n.is_read
                              ? "text-muted-foreground"
                              : "text-foreground font-medium"
                          }`}
                        >
                          {n.notification.title}
                        </span>
                      </div>
                      {n.notification.message && (
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                          {n.notification.message}
                        </p>
                      )}
                      <p className="text-muted-foreground/70 mt-1 text-[11px]">
                        {relativeTime(n.created_at)}
                      </p>
                    </div>

                    {/* Toggle read/unread */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(n._id, !n.is_read);
                      }}
                      disabled={isPending}
                      className="text-muted-foreground hover:text-foreground mt-1 shrink-0 text-[11px] transition-colors disabled:opacity-50"
                      title={n.is_read ? "Mark unread" : "Mark read"}
                    >
                      {n.is_read ? "Unread" : "Read"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/admin/dashboard")}
                  className="text-muted-foreground hover:text-foreground text-xs font-medium"
                >
                  Open dashboard
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
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
