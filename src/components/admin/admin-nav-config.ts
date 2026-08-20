import {
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarCog,
  ClipboardList,
  ContactRound,
  FileText,
  FormInput,
  Film,
  HelpCircle,
  ImagePlay,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  MousePointerClick,
  Newspaper,
  PanelsTopLeft,
  ScrollText,
  Settings,
  Sparkles,
  Star,
  TicketCheck,
  Users,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { AdminRole } from "@/lib/admin/types";

export interface AdminNavItem {
  type?: "item";
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
}

export type AdminNavEntry = AdminNavItem | AdminNavSection;

/**
 * Sidebar nav. Entries with type "section" render as group headers.
 *
 * Grouped by the job the admin is doing, not by data model — someone answering
 * a new enquiry and someone writing an article are in different modes, and the
 * groups follow that. Order runs roughly by how often each group is opened:
 * daily inbound work first, one-off configuration and internal tooling last.
 *
 * A group header is dropped automatically when every item under it is hidden
 * by role (see admin-sidebar.tsx), so "Administration" simply disappears for
 * editors rather than leaving an empty heading behind.
 */
export const ADMIN_NAV: AdminNavEntry[] = [
  // Landing screen — deliberately outside any group so it reads as the root.
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },

  // Inbound and time-sensitive: the only group that needs checking daily, so
  // it sits directly under Dashboard rather than below the content sections.
  { type: "section", label: "Inbox" },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  // Sits with Bookings rather than under Pages: it is where availability is
  // set, which is read far more often than the section copy it also holds.
  { label: "Booking Setup", href: "/admin/booking", icon: CalendarCog },
  // Beside Booking Setup: both configure how an enquiry is captured.
  { label: "Contact Form", href: "/admin/contact-form", icon: FormInput },

  // Page-level structure and copy — the skeleton each page is assembled from.
  { type: "section", label: "Pages" },
  { label: "Page Heroes", href: "/admin/page-heroes", icon: ImagePlay },
  { label: "Page CTAs", href: "/admin/page-ctas", icon: MousePointerClick },
  {
    label: "Shared Sections",
    href: "/admin/shared-sections",
    icon: PanelsTopLeft,
  },
  { label: "About Page", href: "/admin/about-page", icon: ContactRound },
  { label: "Legal Pages", href: "/admin/legal-pages", icon: FileText },

  // What the studio sells, who it sells to, and how the work runs.
  { type: "section", label: "Offerings" },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Industries", href: "/admin/industries", icon: Layers },
  { label: "Process Section", href: "/admin/process-section", icon: Workflow },

  // Credibility: the work itself, plus the proof that sits around it.
  { type: "section", label: "Portfolio & Proof" },
  { label: "Works", href: "/admin/works", icon: Newspaper },
  { label: "Featured Projects", href: "/admin/featured-projects", icon: Star },
  { label: "Showcase Videos", href: "/admin/videos", icon: Film },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Brands", href: "/admin/brands", icon: Building2 },

  // Standalone collections that feed sections across several pages.
  { type: "section", label: "Content" },
  { label: "Insights", href: "/admin/insights", icon: BookOpen },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Team", href: "/admin/team", icon: UsersRound },

  // Set once rather than edited day to day. Only Users is admin-only: site
  // settings carry the footer copy and contact details, which are editors'
  // day-to-day work, so that page is open to them too.
  { type: "section", label: "Administration" },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings },

  // Internal tooling. Actionable queues first, read-only diagnostics last.
  { type: "section", label: "Tech Ops" },
  {
    label: "Support Tickets",
    href: "/admin/tech-ops/support-tickets",
    icon: TicketCheck,
  },
  { label: "Tasks", href: "/admin/tech-ops/tasks", icon: ClipboardList },
  {
    label: "System Logs",
    href: "/admin/tech-ops/system-logs",
    icon: ScrollText,
    roles: ["admin"],
  },
];
