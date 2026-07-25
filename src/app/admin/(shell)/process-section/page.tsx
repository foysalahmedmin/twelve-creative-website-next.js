import { ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PROCESS_DATA } from "@/data/process.data";
import {
  getAdminProcessSection,
  type ApiProcessSection,
} from "@/lib/api/process-section";
import { ProcessSectionForm } from "./process-section-form";

export const dynamic = "force-dynamic";

export default async function ProcessSectionAdminPage() {
  const savedSection = await getAdminProcessSection();
  const initial: ApiProcessSection = savedSection ?? {
    ...PROCESS_DATA,
    process_steps: PROCESS_DATA.process_steps.map((step) => ({ ...step })),
  };

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title="Process Section"
        description="Manage the shared Process section content, media, step order, and step icons. Changes are published across every page that uses this section."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Process Section" },
        ]}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/process" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Preview
            </Link>
          </Button>
        }
      />

      {!savedSection && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Built-in content loaded</AlertTitle>
          <AlertDescription>
            No saved Process record was found. The reviewed defaults are shown
            below; saving will create the managed section without leaving the
            public site empty.
          </AlertDescription>
        </Alert>
      )}

      <ProcessSectionForm initial={initial} />
    </div>
  );
}
