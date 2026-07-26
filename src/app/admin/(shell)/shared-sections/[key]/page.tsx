import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  cloneSharedSection,
  getAdminSharedSection,
  SHARED_SECTION_FALLBACKS,
  SHARED_HEADING_KEYS,
  SHARED_SECTION_KEYS,
  SHARED_SECTION_LABELS,
  type SharedSectionKey,
} from "@/lib/api/shared-sections";
import { SharedSectionForm } from "./shared-section-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ key: string }>;
}

export default async function SharedSectionEditorPage({ params }: Props) {
  const { key: rawKey } = await params;
  if (!SHARED_SECTION_KEYS.includes(rawKey as SharedSectionKey)) notFound();
  const key = rawKey as SharedSectionKey;
  const saved = await getAdminSharedSection(key);
  const initial = saved ?? cloneSharedSection(SHARED_SECTION_FALLBACKS[key]);
  const isHeadingOnly = SHARED_HEADING_KEYS.includes(
    key as (typeof SHARED_HEADING_KEYS)[number],
  );

  return (
    <div className="container max-w-5xl space-y-6 py-8">
      <AdminPageHeader
        title={SHARED_SECTION_LABELS[key]}
        description="Edit the managed content while preserving the production section's existing visual system and responsive behavior."
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Shared Sections", href: "/admin/shared-sections" },
          { label: SHARED_SECTION_LABELS[key] },
        ]}
        action={
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/shared-sections">
              <ArrowLeft className="size-4" /> Back
            </Link>
          </Button>
        }
      />

      {!saved && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Section not configured</AlertTitle>
          <AlertDescription>
            {isHeadingOnly
              ? "These fields are a draft template only. The underlying dynamic items remain public, but this managed heading is hidden until saved as active."
              : "These fields are a draft template only. This section remains hidden publicly until it is saved as active."}
          </AlertDescription>
        </Alert>
      )}

      <SharedSectionForm initial={initial} />
    </div>
  );
}
