import { ArrowLeft, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getAdminIndustryOptions } from "@/lib/api/industries";
import {
  clonePageCta,
  getAdminPageCtaScope,
  PAGE_CTA_FALLBACKS,
  PAGE_CTA_LABELS,
  PAGE_CTA_PLACEMENTS,
  type PageCtaPlacement,
} from "@/lib/api/page-ctas";
import { PageCtaForm } from "./page-cta-form";

export const dynamic = "force-dynamic";

const PUBLIC_PATH: Record<PageCtaPlacement, string> = {
  home: "/",
  about: "/about",
  works: "/works",
  industries: "/industries",
  process: "/process",
  "what-we-build": "/what-we-build",
  "industry-detail": "/industries",
};

interface Props {
  params: Promise<{ placement: string }>;
  searchParams: Promise<{ scope?: string; industry?: string }>;
}

export default async function PageCtaEditorPage({
  params,
  searchParams,
}: Props) {
  const { placement: rawPlacement } = await params;
  if (!PAGE_CTA_PLACEMENTS.includes(rawPlacement as PageCtaPlacement))
    notFound();
  const placement = rawPlacement as PageCtaPlacement;
  const query = await searchParams;
  const isIndustryOverride =
    placement === "industry-detail" && query.scope === "industry";
  const selectedIndustryId = isIndustryOverride ? query.industry : undefined;

  const [industries, saved, globalDefault] = await Promise.all([
    getAdminIndustryOptions(),
    isIndustryOverride && !selectedIndustryId
      ? Promise.resolve(null)
      : getAdminPageCtaScope(placement, selectedIndustryId),
    isIndustryOverride
      ? getAdminPageCtaScope("industry-detail")
      : Promise.resolve(null),
  ]);
  const initial = clonePageCta(
    saved ?? globalDefault ?? PAGE_CTA_FALLBACKS[placement],
  );
  const hasActiveGlobal = Boolean(
    globalDefault && globalDefault.is_active !== false,
  );
  if (isIndustryOverride) {
    initial.industry = selectedIndustryId ?? null;
    if (!saved) {
      delete initial._id;
      delete initial.created_at;
      delete initial.updated_at;
    }
  }

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <AdminPageHeader
        title={
          isIndustryOverride
            ? "Industry CTA Override"
            : `${PAGE_CTA_LABELS[placement]} CTA`
        }
        description={
          isIndustryOverride
            ? "Choose an Industry and publish CTA content that overrides the global Industry Detail default."
            : "Manage this placement's CTA copy, image, links, and public visibility."
        }
        breadcrumb={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Page CTAs", href: "/admin/page-ctas" },
          {
            label: isIndustryOverride
              ? "Industry Override"
              : PAGE_CTA_LABELS[placement],
          },
        ]}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/page-ctas">
                <ArrowLeft className="size-4" /> Back
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={PUBLIC_PATH[placement]} target="_blank">
                <ExternalLink className="size-4" /> Preview
              </Link>
            </Button>
          </div>
        }
      />

      {!saved && (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>
            {isIndustryOverride
              ? "Industry override not configured"
              : "CTA not configured"}
          </AlertTitle>
          <AlertDescription>
            {isIndustryOverride
              ? hasActiveGlobal
                ? "No Industry-specific record exists. This draft starts with the active global CTA content; the Industry keeps using that global CTA until an active override is saved."
                : "No Industry-specific record exists. These fields are a draft template only, and this CTA remains hidden for the Industry until an active override is saved."
              : "These fields are a draft template only. This CTA remains hidden publicly until it is saved as active."}
          </AlertDescription>
        </Alert>
      )}

      <PageCtaForm
        placement={placement}
        initial={initial}
        industries={industries}
        industryOverride={isIndustryOverride}
      />
    </div>
  );
}
