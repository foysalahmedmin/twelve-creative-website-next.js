import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card } from "@/components/ui/card";
import { getAdminContactMessages } from "@/lib/api/contact-messages";
import { MessagesTable } from "./messages-table";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

const FILTERS: { label: string; value?: "unread" | "read" | "archived" }[] = [
  { label: "All" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

const isFilter = (v?: string): v is "unread" | "read" | "archived" =>
  v === "unread" || v === "read" || v === "archived";

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = isFilter(params.filter) ? params.filter : undefined;

  const { data, meta } = await getAdminContactMessages({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Messages"
        description={`${meta?.total ?? data.length} ${filter ? filter : "total"}.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Messages" },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = f.value === filter || (!f.value && !filter);
          const href = f.value ? `/admin/messages?filter=${f.value}` : "/admin/messages";
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <Card className="p-0 overflow-hidden">
        <MessagesTable items={data} />
      </Card>
    </div>
  );
}
