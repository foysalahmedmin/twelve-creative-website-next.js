import { Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  emptyLegalPage,
  getAdminLegalPage,
  isLegalPageSlug,
  LEGAL_PAGE_LABELS,
} from "@/lib/api/legal-pages";
import { LegalPageForm } from "./legal-page-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditLegalPage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  if (!isLegalPageSlug(rawSlug)) notFound();

  const savedPage = await getAdminLegalPage(rawSlug);
  const initial = savedPage ?? emptyLegalPage(rawSlug);

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      {!savedPage && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>{LEGAL_PAGE_LABELS[rawSlug]} is not created</AlertTitle>
          <AlertDescription>
            Add counsel-approved content and save it as a draft. Nothing is
            shown publicly until you explicitly publish it with an effective
            date.
          </AlertDescription>
        </Alert>
      )}
      <LegalPageForm initial={initial} />
    </div>
  );
}
