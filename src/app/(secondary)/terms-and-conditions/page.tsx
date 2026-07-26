import { LegalPageView } from "@/components/legal/legal-page-view";
import { PageHeader } from "@/components/sections/page-header-section";
import { getPublicLegalPage } from "@/lib/api/legal-pages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicLegalPage("terms-and-conditions");
  if (!page) {
    return {
      title: "Terms and Conditions | Twelve Creative",
      description: "Twelve Creative terms and conditions page.",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: page.seo.title,
    description: page.seo.description,
  };
}

export default async function TermsAndConditionsPage() {
  const page = await getPublicLegalPage("terms-and-conditions");
  const title = page?.title ?? "Terms and Conditions";
  const description =
    page?.seo.description ??
    "This page is being prepared. Contact Twelve Creative for terms information.";
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={[{ label: title, active: true }]}
      />
      <LegalPageView page={page} />
    </main>
  );
}
