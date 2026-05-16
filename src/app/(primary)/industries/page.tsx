import { PageHeader } from "@/components/sections/page-header-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries | Twelve Creative",
  description:
    "Twelve Creative works with hospitality brands, real estate developers, private aviation companies, and professional service firms.",
};

export default function IndustriesPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="We work in industries where trust and presentation drive decisions."
        description="Hospitality, real estate, aviation, and professional services — sectors where positioning and creative directly impact revenue."
        breadcrumb={[{ label: "Industries", active: true }]}
      />
    </main>
  );
}
