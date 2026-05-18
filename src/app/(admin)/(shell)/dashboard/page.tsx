import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSession } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getAdminSession();

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
          This is your control center. Modules will appear here as they ship — testimonials and the visual library land next.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pending bookings</CardDescription>
            <CardTitle className="font-heading text-3xl font-medium">—</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">
            Will populate once the booking module is live.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Unread messages</CardDescription>
            <CardTitle className="font-heading text-3xl font-medium">—</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">
            Will populate once the contact module is live.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Testimonials live</CardDescription>
            <CardTitle className="font-heading text-3xl font-medium">—</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-xs">
            Will populate once the testimonial module is live.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Phase 1 — Foundation complete</CardTitle>
          <CardDescription>
            Auth, admin shell, and protected routing are in place. Continue with Phase 2 (Testimonials) next.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
