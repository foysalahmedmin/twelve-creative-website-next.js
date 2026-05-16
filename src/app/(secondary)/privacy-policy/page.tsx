import { PageHeader } from "@/components/sections/page-header-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Twelve Creative",
  description: "Our privacy policy and data protection practices.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Privacy Policy"
        description="Learn how we collect, use, and protect your personal information."
        breadcrumb={[{ label: "Privacy Policy", active: true }]}
      />
    </main>
  );
}
