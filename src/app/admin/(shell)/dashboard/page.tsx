import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/lib/admin/session";
import { getPendingBookingCount } from "@/lib/api/bookings";
import { getUnreadMessageCount } from "@/lib/api/contact-messages";
import { getAdminTestimonials } from "@/lib/api/testimonials";
import { getAdminShowcaseVideos } from "@/lib/api/showcase-videos";
import { getAdminWorks } from "@/lib/api/works";
import { getAdminBrands } from "@/lib/api/brands";

export const dynamic = "force-dynamic";

async function safeCount(p: Promise<{ meta?: { total: number } }>): Promise<number> {
  try {
    const res = await p;
    return res.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

interface StatCardProps {
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
  highlight?: boolean;
}

function StatCard({ label, value, href, hint, highlight }: StatCardProps) {
  const inner = (
    <Card
      className={
        highlight ? "bg-primary/[0.04] border-primary/30" : undefined
      }
    >
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-heading text-3xl font-medium tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      {hint && (
        <CardContent className="text-muted-foreground text-xs">{hint}</CardContent>
      )}
    </Card>
  );
  return href ? (
    <Link href={href} className="block transition-opacity hover:opacity-90">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default async function AdminDashboardPage() {
  const [
    user,
    pendingBookings,
    unreadMessages,
    testimonialsTotal,
    videosTotal,
    worksTotal,
    brandsTotal,
  ] = await Promise.all([
    getAdminSession(),
    getPendingBookingCount(),
    getUnreadMessageCount(),
    safeCount(getAdminTestimonials({ limit: 1 })),
    safeCount(getAdminShowcaseVideos({ limit: 1 })),
    safeCount(getAdminWorks({ limit: 1 })),
    safeCount(getAdminBrands({ limit: 1 })),
  ]);

  return (
    <div className="container max-w-6xl space-y-8 py-10">
      <header className="space-y-1.5">
        <span className="bg-primary/10 text-primary border-primary/20 inline-flex rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
          Dashboard
        </span>
        <h1 className="font-heading text-foreground text-3xl font-medium tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-muted-foreground max-w-xl text-base">
          Quick snapshot of what's pending and what's live across the site.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-foreground/70 text-xs font-bold tracking-widest uppercase">
          Inbox
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Pending bookings"
            value={pendingBookings}
            href="/admin/bookings?filter=pending"
            hint="Click to triage"
            highlight={pendingBookings > 0}
          />
          <StatCard
            label="Unread messages"
            value={unreadMessages}
            href="/admin/messages?filter=unread"
            hint="Click to triage"
            highlight={unreadMessages > 0}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-foreground/70 text-xs font-bold tracking-widest uppercase">
          Content
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Testimonials"
            value={testimonialsTotal}
            href="/admin/testimonials"
          />
          <StatCard
            label="Showcase videos"
            value={videosTotal}
            href="/admin/videos"
          />
          <StatCard label="Works" value={worksTotal} href="/admin/works" />
          <StatCard label="Brands" value={brandsTotal} href="/admin/brands" />
        </div>
      </section>
    </div>
  );
}
