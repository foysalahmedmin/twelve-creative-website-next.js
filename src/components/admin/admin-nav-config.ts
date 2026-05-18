import {
  Building2,
  CalendarCheck,
  Film,
  HelpCircle,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "@/lib/admin/types";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** When true, link renders but is visually muted and tagged "Soon". */
  soon?: boolean;
  /** Restrict to specific roles. Defaults to both. */
  roles?: AdminRole[];
}

/**
 * Sidebar nav. Items marked `soon` are placeholders for upcoming phases —
 * they show in the UI to communicate scope, but won't 404 because each
 * phase ships a real page when its module lands.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Visual Library", href: "/admin/videos", icon: Film, soon: true },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck, soon: true },
  { label: "Messages", href: "/admin/messages", icon: Mail, soon: true },
  { label: "Works", href: "/admin/works", icon: Newspaper, soon: true },
  { label: "Brands", href: "/admin/brands", icon: Building2, soon: true },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle, soon: true },
  { label: "Users", href: "/admin/users", icon: Users, soon: true, roles: ["admin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, soon: true, roles: ["admin"] },
];
