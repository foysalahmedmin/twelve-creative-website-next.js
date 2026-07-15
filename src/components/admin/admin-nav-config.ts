import {
  BookOpen,
  Building2,
  CalendarCheck,
  ClipboardList,
  Film,
  HelpCircle,
  ImagePlay,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  ScrollText,
  Settings,
  Sparkles,
  Star,
  TicketCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "@/lib/admin/types";

export interface AdminNavItem {
  type?: "item" | "section";
  label: string;
  href: string;
  icon: LucideIcon;
  /** When true, link renders but is visually muted and tagged "Soon". */
  soon?: boolean;
  /** Restrict to specific roles. Defaults to both. */
  roles?: AdminRole[];
}

export interface AdminNavSection {
  type: "section";
  label: string;
  href: "";
  icon: LucideIcon;
}

export type AdminNavEntry = AdminNavItem | AdminNavSection;

/**
 * Sidebar nav. Items with type "section" render as group headers.
 */
export const ADMIN_NAV: AdminNavEntry[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Page Heroes", href: "/admin/page-heroes", icon: ImagePlay },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Industries", href: "/admin/industries", icon: Layers },
  { label: "Featured Projects", href: "/admin/featured-projects", icon: Star },
  { label: "Showcase Videos", href: "/admin/videos", icon: Film },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "Works", href: "/admin/works", icon: Newspaper },
  { label: "Brands", href: "/admin/brands", icon: Building2 },
  { label: "Insights", href: "/admin/insights", icon: BookOpen },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Team", href: "/admin/team", icon: UsersRound },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
  // Tech Ops section
  { type: "section", label: "Tech Ops", href: "", icon: ScrollText },
  {
    label: "System Logs",
    href: "/admin/tech-ops/system-logs",
    icon: ScrollText,
    roles: ["admin"],
  },
  {
    label: "Support Tickets",
    href: "/admin/tech-ops/support-tickets",
    icon: TicketCheck,
  },
  { label: "Tasks", href: "/admin/tech-ops/tasks", icon: ClipboardList },
];
