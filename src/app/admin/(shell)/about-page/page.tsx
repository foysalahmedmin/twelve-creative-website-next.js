import { ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BUILT_IN_ABOUT_PAGE, getAdminAboutPage } from "@/lib/api/about-page";
import { AboutPageForm } from "./about-page-form";

export const dynamic = "force-dynamic";

export default async function AboutPageAdmin() {
  const savedPage = await getAdminAboutPage();
  const initial = savedPage ?? structuredClone(BUILT_IN_ABOUT_PAGE);

  return (
    <div className="container max-w-6xl space-y-6 py-8">
      <AdminPageHeader
        title="About Page"
        description="Manage the About page mission, story, founder, gallery, media, order, and visibility from one place."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "About Page" },
        ]}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/about" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Preview
            </Link>
          </Button>
        }
      />

      {!savedPage && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>About content not configured</AlertTitle>
          <AlertDescription>
            These fields are a draft template only. The managed About sections
            remain hidden publicly until this page is saved as active.
          </AlertDescription>
        </Alert>
      )}

      <AboutPageForm initial={initial} />
    </div>
  );
}
