import { LegalPageView } from "@/components/legal/legal-page-view";
import { PageHeader } from "@/components/sections/page-header-section";
import { getPublicLegalPage } from "@/lib/api/legal-pages";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublicLegalPage("privacy-policy");
  if (!page) {
    return {
      title: "Privacy Policy | Twelve Creative",
      description: "Twelve Creative privacy policy page.",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getPublicLegalPage("privacy-policy");
  const title = page?.title ?? "Privacy Policy";
  const description =
    page?.seo.description ??
    "This page is being prepared. Contact Twelve Creative for privacy information.";
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
