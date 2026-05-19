import {
  BookOpen,
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
  UsersRound,
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
  { label: "Visual Library", href: "/admin/videos", icon: Film },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Works", href: "/admin/works", icon: Newspaper },
  { label: "Brands", href: "/admin/brands", icon: Building2 },
  { label: "Insights", href: "/admin/insights", icon: BookOpen },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Team", href: "/admin/team", icon: UsersRound },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
];
