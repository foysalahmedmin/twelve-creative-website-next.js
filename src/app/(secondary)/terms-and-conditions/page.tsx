import { PageHeader } from "@/components/sections/page-header-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Twelve Creative",
  description: "Terms of use and service conditions for Twelve Creative.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Terms & Conditions"
        description="Please read these terms and conditions carefully before using our services."
        breadcrumb={[{ label: "Terms & Conditions", active: true }]}
      />
    </main>
  );
}
