import { PageHeader } from "@/components/sections/page-header-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Twelve Creative | Strategy, Creative & Systems",
  description:
    "Twelve Creative was built from the belief that creative work should be connected to the business it serves. Led by Carlos Doce.",
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Built for businesses that need strategy and execution in the same room."
        description="Twelve Creative was built from the belief that creative work should be connected to the business it serves."
        breadcrumb={[{ label: "About", active: true }]}
      />
    </main>
  );
}
