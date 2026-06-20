import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminFaqs } from "@/lib/api/faqs";
import { FaqsTable } from "./faqs-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string; search?: string }>;
}

export default async function FaqsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminFaqs({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 100,
    filter:
      params.filter === "active" || params.filter === "inactive"
        ? params.filter
        : undefined,
  });

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="FAQs"
        description={`${meta?.total ?? data.length} total · only active items appear publicly.`}
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "FAQs" },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/faqs/new">
              <Plus className="size-4" />
              New FAQ
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search FAQs…" />
      </Suspense>

      <Card className="p-0 overflow-hidden">
        <FaqsTable items={data} />
      </Card>
    </div>
  );
}
