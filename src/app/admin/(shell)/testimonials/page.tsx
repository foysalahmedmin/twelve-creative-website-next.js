import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAdminTestimonials } from "@/lib/api/testimonials";
import { TestimonialsTable } from "./testimonials-table";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ search?: string; filter?: string; page?: string }>;
}

export default async function TestimonialsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data, meta } = await getAdminTestimonials({
    search: params.search,
    page: params.page ? Number(params.page) : 1,
    limit: 50,
    filter:
      params.filter === "active" || params.filter === "inactive"
        ? params.filter
        : undefined,
  });

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="Testimonials"
        description={`${meta?.total ?? data.length} total · public site only renders items toggled active.`}
        breadcrumb={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Testimonials" }]}
        action={
          <Button asChild>
            <Link href="/admin/testimonials/new">
              <Plus className="size-4" />
              New testimonial
            </Link>
          </Button>
        }
      />

      <Suspense fallback={null}>
        <AdminSearch placeholder="Search testimonials…" />
      </Suspense>

      <Card className="p-0 overflow-hidden">
        <TestimonialsTable items={data} />
      </Card>
    </div>
  );
}
